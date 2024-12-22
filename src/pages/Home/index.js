import { useEffect, useMemo, useState, useRef, useCallback, createContext, useReducer, memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Video from '~/pages/Home/VideoWrapper';
import * as videoService from '~/services/videoService';
import { useIsVisible } from '~/hooks';
import Spinner from '~/components/Spinner';
import { Outlet } from 'react-router-dom';
import { initialState, reducer, actions } from './homeReducer';
import { v4 as uuidv4 } from 'uuid';

const cx = classNames.bind(styles);
const HomeContext = createContext();

const INITIAL_VOLUME = '0';
const INITIAL_PAGE = 1;
const getAutoScroll = () => JSON.parse(localStorage.getItem('auto-scroll'));
function Home() {
    const [listVideos, setListVideos] = useState([]);

    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(INITIAL_VOLUME);
    const [isAutoScroll, setIsAutoScroll] = useState(getAutoScroll); //initializer function
    const [page, setPage] = useState(INITIAL_PAGE);
    const [isLoading, setIsLoading] = useState(false);
    const [loadMore, setLoadMore] = useState(false);

    const [state, dispatch] = useReducer(reducer, initialState);

    const contextValue = useMemo(() => ({ state, dispatch }), [state]);

    const { isVisible: isBottomPage, targetRef: loaderRef } = useIsVisible({
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
    });

    const _currentVolume = useRef(volume);

    const handleMuted = useCallback(() => {
        setIsMuted((prevIsMute) => {
            const volumeValue = prevIsMute ? _currentVolume.current : '0';
            setVolume(volumeValue);
            return !prevIsMute;
        });
    }, []);

    const handleSetVolume = useCallback((currentVolume) => {
        const isMuted = currentVolume === '0' ? true : false;
        setIsMuted(isMuted);
        _currentVolume.current = currentVolume;
        setVolume(currentVolume);
    }, []);

    const handleSetAutoScroll = useCallback(() => {
        setIsAutoScroll((prevAutoScroll) => !prevAutoScroll);
    }, []);

    useEffect(() => {
        localStorage.setItem('auto-scroll', JSON.stringify(isAutoScroll));
    }, [volume, isAutoScroll]);

    useEffect(() => {
        let ignore = false;
        const fetchData = async () => {
            setIsLoading(true);
            const listVideos = await videoService.getVideos({ type: 'for-you', page });
            setIsLoading(false);
            setLoadMore(false);

            if (!listVideos) {
                return;
            }

            if (Array.isArray(listVideos) && listVideos.length === 0) {
                // alert('there are not any videos');
                return;
            }

            if (!ignore) {
                setListVideos((prevListVideos) => [...prevListVideos, ...listVideos]);
            }
        };
        fetchData();

        return () => {
            ignore = true;
        };
    }, [page]);

    useEffect(() => {
        if (isBottomPage) {
            setLoadMore(true);
        } else {
        }
    }, [isBottomPage]);

    useEffect(() => {
        if (loadMore) {
            setPage((prePage) => prePage + 1);
        }
    }, [loadMore]);

    const renderVideos = useMemo(() => {
        console.log('re-calc');
        dispatch(
            actions.getVideoUuids(listVideos.map((video) => ({ nickname: video.user.nickname, uuid: video.uuid }))),
        );
        return listVideos.map((video, index) => {
            return (
                <Video
                    key={video.id}
                    data={video}
                    muted={isMuted}
                    volume={volume}
                    autoScroll={isAutoScroll}
                    onMuted={handleMuted}
                    onSetVolume={handleSetVolume}
                    onSetAutoScroll={handleSetAutoScroll}
                    number={index}
                />
            );
        });
    }, [listVideos, isMuted, volume, isAutoScroll]);

    return (
        <HomeContext.Provider value={contextValue}>
            <div className={cx('wrapper')}>
                {renderVideos}
                <div
                    ref={loaderRef}
                    className={cx('load-more')}
                    style={{
                        display: listVideos.length > 0 ? 'block' : 'none',
                        height: listVideos.length > 0 ? '60px' : '0px',
                    }}
                >
                    {isLoading && <Spinner fontSize={'3.2rem'} color={'rgb(167 167 171)'} />}
                </div>
            </div>
            <Outlet key={uuidv4()} />
        </HomeContext.Provider>
    );
}

export { HomeContext };
export default Home;
