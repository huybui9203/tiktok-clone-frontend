import { useState, useRef, useEffect, useCallback, memo, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';

import styles from './VideoWrapper.module.scss';
import Avatar from '~/components/Avatar';
import RangeSlider from '~/components/RangeSlider';
import Video from '~/components/Video';
import { useAuth, useDebounce, useIsVisible, useStore } from '~/hooks';
import Image from '~/components/Image';
import {
    HeartIconSolid,
    MessageIcon,
    BookmarkIcon,
    ShareIcon,
    PlusIcon,
    VolumeIcon,
    VolumeXmarkIcon,
    MiniPlayerIcon,
    ArrowUpIcon,
    ArrowUpSlashIcon,
    EllipsisIcon,
    MusicIcon,
    CheckIcon,
} from '~/components/Icons';
import Spinner from '~/components/Spinner';
import CircleButtonIcon from '~/components/CircleButtonIcon';
import { actions } from '~/store';
import { HomeContext } from '..';
import { linkToRoute as to } from '~/config/routes';

const cx = classNames.bind(styles);
const HEADER_HEIGHT = 60;

function VideoWrapper({ data, muted, volume, autoScroll, onMuted, onSetVolume, onSetAutoScroll, number }) {
    const [seeMore, setSeeMore] = useState(false);
    const [play, setPlay] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isTextOverflow, setIsTextOverflow] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [isAddToFavorite, setIsAddToFavorite] = useState(false);

    const {
        authState: { user },
    } = useAuth();

    const { dispatch } = useStore();

    const {
        state: { videoUuids },
    } = useContext(HomeContext);

    const navigate = useNavigate();

    const { isVisible, targetRef } = useIsVisible({
        root: null,
        rootMargin: '-200px 0px -200px 0px',
        threshold: 0.3,
    });

    const videoWrapperRef = useRef(null);
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const volumeRef = useRef(null);
    const imageRef = useRef(null);
    const descriptionRef = useRef(null);

    let { width: videoWidth, height: videoHeight } = data.meta;

    const delay = useCallback((callback, delay) => {
        const timeId = setTimeout(callback, delay);
        return timeId;
    }, []);

    const handlePlay = () => {
        if (videoRef.current) {
            setPlay(!play);
            play ? videoRef.current.pause() : videoRef.current.play();
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) {
            return;
        }
        if (isLoading === true) {
            setIsLoading(false);
        }
        const currentTime = videoRef.current.getCurrentTime();
        const lengthVideo = videoRef.current.getDuration();
        const currProgress = Math.round((currentTime / lengthVideo) * 100);
        if (progressRef.current) {
            progressRef.current.setValue(currProgress.toString());
        }
    };

    const handleSeek = (currPosition) => {
        if (!videoRef.current) {
            progressRef.current.setValue('0');
            return;
        }
        // if (isLoading) {
        //     return;
        // }
        const lengthVideo = videoRef.current.getDuration();
        if (!isNaN(lengthVideo)) {
            const currentTime = (currPosition / 100) * lengthVideo;
            videoRef.current.setCurrentTime(currentTime);
        }
    };

    const handleEnded = () => {
        if (autoScroll) {
            setPlay(false);
            progressRef.current.setValue('0');

            const nextVideo = videoWrapperRef.current.nextSibling;
            if (!nextVideo) {
                return;
            }
            window.scrollTo({
                top: nextVideo.offsetTop - HEADER_HEIGHT,
                behavior: 'smooth',
            });
        } else if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleSeeMore = () => {
        setSeeMore(!seeMore);
    };

    const handleFollow = () => {
        if (user) {
            setIsFollow(!isFollow);
        } else {
            dispatch(actions.showForm());
        }
    };

    const handleLike = () => {
        if (user) {
            setIsLike(!isLike);
        } else {
            dispatch(actions.showForm());
        }
    };

    const handleAddToFavorite = () => {
        if (user) {
            setIsAddToFavorite(!isAddToFavorite);
        } else {
            dispatch(actions.showForm());
        }
    };

    const handleShare = () => {
        if (user) {
            // setIsAddToFavorite(!isAddToFavorite);
        } else {
            dispatch(actions.showForm());
        }
    };

    const handleClickCommentButton = () => {
        if (user) {
            const currIndexVideo = videoUuids.findIndex((video) => video.uuid === data.uuid);
            const preVideo = currIndexVideo > 0 ? videoUuids[currIndexVideo - 1] : null;
            const nextVideo = currIndexVideo < videoUuids.length - 1 ? videoUuids[currIndexVideo + 1] : null;
            const payload = [preVideo, nextVideo];
            navigate(to.video(data.user.username, data.uuid), { state: payload });
            
            videoRef.current?.pause()
        } else {
            dispatch(actions.showForm());
        }
    };
    const [debouncedMountVideo] = useDebounce(isVisible, 800)

    useEffect(() => {
        volumeRef.current.setValue(volume);
        if (videoRef.current) {
            videoRef.current.setMuted(muted);
            videoRef.current.setVolume(volume);
        }
    }, [muted, volume, isVisible, debouncedMountVideo]);
    
    useEffect(() => {
        const startVideoOnMove = () => {
            setPlay(true);
            if (videoRef.current) {
                videoRef.current.play();
            }
        };
        const stopVideoOnMove = () => {
            setPlay(false);
            progressRef.current.setValue('0');
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };

        let timeId;

        if (isVisible) {
            // timeId = delay(startVideoOnMove, 5000);
            startVideoOnMove()
        } else {
            stopVideoOnMove();
        }

        // return () => clearTimeout(timeId);
    }, [debouncedMountVideo]);

    

    //in viewport after 800ms mount, out of viewport unmount

    useEffect(() => {
        if (descriptionRef.current.clientWidth >= targetRef.current.clientWidth) {
            setIsTextOverflow(true);
        } else {
            setIsTextOverflow(false);
        }
    }, []);

    return (
        <div
            className={cx('wrapper', {
                vertical: videoWidth < videoHeight,
                horizontal: videoWidth > videoHeight,
                square: videoWidth === videoHeight,
            })}
            ref={videoWrapperRef}
        >
            <div
                className={cx('video-wrapper')}
                ref={targetRef}
                style={{
                    aspectRatio: `${videoWidth} / ${videoHeight}`,
                }}
            >
                <Image
                    ref={imageRef}
                    className={cx('thumbnail')}
                    src={data?.thumb?.url}
                    alt={data.description}
                    decoding={'async'}
                />

                {debouncedMountVideo && (
                    <>
                        <Video
                            ref={videoRef}
                            className={cx('video')}
                            src={data.file_url}
                            preload={'auto'}
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={handleEnded}
                            onProgress={() => setIsLoading(true)} //loading more data
                        />

                        {isLoading && (
                            <Spinner className={cx('video-loading')} fontSize={'3.2rem'} color={'#fff'} slow />
                        )}
                    </>
                )}
                <div className={cx('controls-top')}>
                    <span className={cx('icon-controls')} onClick={onMuted}>
                        {muted ? <VolumeXmarkIcon /> : <VolumeIcon />}
                    </span>
                    <div className={cx('volume-wrapper')}>
                        <RangeSlider
                            ref={volumeRef}
                            className={cx('volume')}
                            initValue={'0'}
                            colorLeft={'#fff'}
                            color={'rgba(255, 255, 255, 0.34)'}
                            onInput={onSetVolume}
                        />
                    </div>
                    <Tippy
                        className={'tippy-no-arrow'}
                        content={`Auto scroll is ${autoScroll ? 'on' : 'off'}`}
                        placement="bottom"
                        offset={[0, 4]}
                        hideOnClick={false}
                    >
                        <span className={cx('icon-controls')} onClick={onSetAutoScroll}>
                            {autoScroll ? <ArrowUpIcon /> : <ArrowUpSlashIcon />}
                        </span>
                    </Tippy>
                    <span className={cx('icon-controls')}>
                        <EllipsisIcon />
                    </span>
                </div>
                <div className={cx('card-bottom')}>
                    <Link className={cx('video-author')} to={to.profile(data.user.nickname)}>
                        <h3>{data.user.nickname}</h3>
                        {data.user.tick && (
                            <span className={cx('check')}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                        )}
                    </Link>
                    <div
                        className={cx('video-description', {
                            expanded: seeMore,
                        })}
                    >
                        <span
                            ref={descriptionRef}
                            className={cx('text-description')}
                            style={isTextOverflow ? { overflow: 'hidden', width: '100%' } : {}}
                        >
                            {data.description}
                        </span>

                        {isTextOverflow && (
                            <button className={cx('more-btn')} onClick={handleSeeMore}>
                                {seeMore ? 'less' : 'more'}
                            </button>
                        )}
                    </div>
                    <h4 className={cx('video-music')}>
                        <MusicIcon className={cx('icon-music')} />
                        <span>{data?.music?.name}</span>
                    </h4>
                    <div className={cx('controls-bottom')}>
                        <span className={cx('icon-controls')} onClick={handlePlay}>
                            {play ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                        </span>
                        <RangeSlider
                            ref={progressRef}
                            className={cx('progress')}
                            initValue={'0'}
                            colorLeft={'#fff'}
                            color={'rgba(255, 255, 255, 0.34)'}
                            hover
                            onInput={handleSeek}
                        />
                        <Tippy className={'tippy-no-arrow'} content="Floating Player" placement="top" offset={[0, 4]}>
                            <span className={cx('icon-controls')}>
                                <MiniPlayerIcon />
                            </span>
                        </Tippy>
                    </div>
                </div>
            </div>

            <div className={cx('action')}>
                <div className={cx('avatar-wrapper')}>
                    <Link className={cx('avatar-link')} to={to.profile(data.user.username)}>
                        <Avatar width={'48px'} src={data?.user?.avatar?.sm} alt={data.user.nickname} />
                    </Link>

                    <CircleButtonIcon
                        className={cx('btn-follow', { follow: isFollow })}
                        size={24}
                        icon={isFollow ? <CheckIcon width={14} height={14} /> : <PlusIcon width={14} height={14} />}
                        iconColor={isFollow ? 'var(--primary)' : '#fff'}
                        onClick={handleFollow}
                    />
                </div>

                <CircleButtonIcon //like button
                    icon={<HeartIconSolid className={cx({ icon: isLike })} />}
                    onClick={handleLike}
                    infoAt={{ info: data.likes_count, placement: 'bottom' }}
                    iconColor={(isLike || data.is_liked) && 'var(--primary)'}
                />

                <CircleButtonIcon //comment button
                    icon={<MessageIcon />}
                    onClick={handleClickCommentButton}
                    infoAt={{ info: data.comments_count, placement: 'bottom' }}
                />

                <CircleButtonIcon //view button
                    icon={<BookmarkIcon className={cx({ icon: isAddToFavorite })} />}
                    onClick={handleAddToFavorite}
                    infoAt={{ info: data.views_count, placement: 'bottom' }}
                    iconColor={isAddToFavorite && '#face15'}
                />

                <CircleButtonIcon //share button
                    icon={<ShareIcon />}
                    onClick={handleShare}
                    infoAt={{ info: data.shares_count, placement: 'bottom' }}
                />
            </div>
        </div>
    );
}

VideoWrapper.propTypes = {
    data: PropTypes.object.isRequired,
};

export default memo(VideoWrapper);
