import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    createContext,
    lazy,
    Suspense,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesUp } from '@fortawesome/free-solid-svg-icons';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import Image from '~/components/Image';
import { Tabs, Tab } from '~/components/Tabs';
import Profile from './Profile';
import Video from './VideoControls';
import CommentEditor from './CommentEditor';
import Button from '~/components/Button';
import { getVideo } from '~/services/videoService';
import Spinner from '~/components/Spinner';
import styles from './VideoModal.module.scss';
import { usePostComment } from './Comments/hooks';
import { sassNull } from 'sass';
import { commentKeys } from './Comments/queries';

const Comments = lazy(() => import('./Comments/Comments'));

const cx = classNames.bind(styles);
const SCROLLY_SHOW_BACK_TO_TOP = 10;

export const VideoContext = createContext();

function VideoModal({ modal }) {
    const [tabIndex, setTabIndex] = useState(1);
    const [showButtonBackToTop, setShowButtonBackToTop] = useState(false);
    const [totalComments, setTotalComments] = useState(undefined);

    const { uuid, username } = useParams();
    const currVideo = { uuid, username };
    const location = useLocation();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (!username.match(/^@/)) {
            navigate(`/404?fromUrl=${location.pathname}`);
        }
    }, []);

    const [preVideo, nextVideo] = location.state || [];
    const commentContainerRef = useRef(null);
    const videoModalRef = useRef(null);

    const fetchVideo = async (uuid) => {
        const data = await getVideo(uuid);
        if (!data) {
            return new Promise('something was wrong!');
        }
        return data;
    };

    const queryClient = useQueryClient();

    useEffect(() => {
        return () => {
            //keep first comment page when video unmounted
            queryClient.setQueryData(commentKeys.list(data?.id), (data) => {
                if (data) {
                    return {
                        pages: data.pages.slice(0, 1),
                        pageParams: data.pageParams.slice(0, 1),
                    };
                }
            });
        };
    }, []);

    const { isPending, isError, data, error, isSuccess, isFetching, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['video', uuid],
        queryFn: () => fetchVideo(uuid),
        // placeholderData: keepPreviousData,  //state always success except first time no pre data
        // placeholderData: () => {return queryClient
        //     .getQueryData(['video', uuid])
        //     ?.find((d) => d.uuid === uuid)},
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 1000, // after 5000 refetch api
        gcTime: 5 * 60 * 1000, // after 5 minutes ['video'] clear cache data
    });

    // prefetch next video
    useEffect(() => {
        if (!isPlaceholderData && nextVideo) {
            queryClient.prefetchQuery({
                queryKey: ['video', nextVideo.uuid],
                queryFn: () => fetchVideo(nextVideo.uuid),
                staleTime: 5 * 1000,
            });
        }
    }, [data, isPlaceholderData, queryClient]);

    const handleSelectedTab = (tabIndex) => {
        setTabIndex(tabIndex);
    };

    const postComment = usePostComment(data?.id);
    const handlePostComment = useCallback((comment, tags, authorVideoId, parentId) => {
        postComment.mutate({ comment, videoId: data?.id });
    }, []);

    const handleBackToTop = () => {
        commentContainerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const renderResultTab = useMemo(() => {
        switch (tabIndex) {
            case 1:
                if (isPending) {
                    //first time mount
                    return <></>;
                }
                if (data?.allows.includes('comment')) {
                    return <Comments />;
                } else {
                    return <div className={cx('comment-turned-off')}>Comments are turned off</div>;
                }
            case 2:
                return <p>videos</p>;
            default:
                break;
        }
    }, [tabIndex, data?.allows]);

    const videoContextValue = useMemo(() => {
        const videoUuid = uuid;
        const videoId = data?.id;
        const authorId = data?.user?.id;
        const allowComment = data?.allows.indexOf('comment') > -1;
        return { videoUuid, videoId, authorId, allowComment, setTotalComments };
    }, [data?.user, data?.allows]);

    useEffect(() => {
        const observerRefValue = videoModalRef.current;
        disableBodyScroll(observerRefValue);
        return () => {
            if (observerRefValue) {
                enableBodyScroll(observerRefValue);
            }
        };
    }, []);

    useEffect(() => {
        const commentContainer = commentContainerRef.current;
        const handleScroll = () => {
            if (commentContainer.scrollTop > SCROLLY_SHOW_BACK_TO_TOP) {
                setShowButtonBackToTop(true);
            } else {
                setShowButtonBackToTop(false);
            }
        };
        commentContainer.addEventListener('scroll', handleScroll);
        return () => commentContainer.removeEventListener('scroll', handleScroll);
    }, []);

    const uuids = useMemo(() => [preVideo, currVideo, nextVideo], []);

    return (
        <VideoContext.Provider value={videoContextValue}>
            <div ref={videoModalRef} className={cx('wrapper', { modal })}>
                <div className={cx('video-container')}>
                    {isSuccess && (
                        <>
                            <Image className={cx('bgblur-video')} src={data.thumb?.url} alt={data.description} />
                            <Video data={data} uuids={uuids} disabledNextBtn={isPlaceholderData} />
                        </>
                    )}
                    {isLoading && <Spinner className={cx('video-loading')} fontSize={'3.2rem'} color={'#fff'} slow />}
                </div>
                <div className={cx('content')}>
                    <div ref={commentContainerRef} className={cx('comment-container')}>
                        {isSuccess && <Profile data={data} />}
                        {isLoading && <Spinner />}
                        <Tabs className={cx('tabs')} onSelectedTab={handleSelectedTab}>
                            <Tab
                                label={`Comments ${totalComments === undefined ? '' : `(${totalComments})`}`}
                                ratioX={1}
                            />
                            <Tab label={'Creator videos'} ratioX={1} />
                        </Tabs>
                        <Suspense fallback={<Spinner />}>{renderResultTab}</Suspense>
                        {showButtonBackToTop && (
                            <Button
                                className={cx('btn-scroll-top')}
                                round
                                rightIcon={<FontAwesomeIcon icon={faAnglesUp} />}
                                onClick={handleBackToTop}
                            >
                                Back to top
                            </Button>
                        )}
                    </div>
                    <div className={cx('comment-bottom')}>
                        <CommentEditor onSendComment={handlePostComment} />
                    </div>
                </div>
            </div>
        </VideoContext.Provider>
    );
}

//todo:
//render like count, ... => K, M,
//replace control btn to CircleButtonIcon
//tabs: optimize
//comment
//video controls
//pass data from home
//event copy link
//post follow, unfollow, like, ...
//get list comment
//optimization video modal

export default VideoModal;
