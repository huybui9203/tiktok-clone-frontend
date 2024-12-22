import { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faEllipsis, faPause, faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';
import { MiniPlayerIcon, VolumeIcon, VolumeXmarkIcon, ArrowUpIcon, ArrowUpSlashIcon } from '~/components/Icons';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './VideoModal.module.scss';
import RangeSlider from '~/components/RangeSlider';
import Search from '~/layouts/components/Search';
import Image from '~/components/Image';
import Video from '~/components/Video';
import CircleButtonIcon from '~/components/CircleButtonIcon';
import formatTime from '~/utils/formatTime';
import { HomeContext } from '../Home';
import Spinner from '~/components/Spinner';
import { linkToRoute as to } from '~/config/routes';
const cx = classNames.bind(styles);
function VideoControls({ data, uuids, disabledNextBtn }) {
    const navigate = useNavigate();
    const [video, setVideo] = useState({
        isPlay: true,
        isAutoScroll: false,
        isMuted: false,
        currentTime: 0,
        duration: 0,
    });

    console.log('video control');
    const [isLoading, setLoading] = useState(false);

    const videoRef = useRef(null);
    const volumeRef = useRef(null);
    const progressRef = useRef(null);

    const { isPlay, isAutoScroll, isMuted } = video;

    const [preVideo, currVideo, nextVideo] = uuids;
    const {
        state: { videoUuids },
    } = useContext(HomeContext);
    
    const handlePreviousVideo = () => {
        const currIndexVideo = videoUuids.findIndex((video) => video.uuid === preVideo.uuid);
        const newPreVideo = currIndexVideo > 0 ? videoUuids[currIndexVideo - 1] : null;
        const newNextVideo = currVideo;
        const payload = [newPreVideo, newNextVideo];
        navigate(to.video(preVideo.nickname, preVideo.uuid), { state: payload, replace: true });
    };

    const handleNextVideo = () => {
        const currIndexVideo = videoUuids.findIndex((video) => video.uuid === nextVideo.uuid);
        const newPreVideo = currVideo;
        const newNextVideo = currIndexVideo < videoUuids.length - 1 ? videoUuids[currIndexVideo + 1] : null;
        const payload = [newPreVideo, newNextVideo];
        navigate(to.video(nextVideo?.nickname, nextVideo.uuid), { state: payload, replace: true });
    };

    const handleAutoScrollVideo = () => {
        setVideo((prevVideo) => ({
            ...prevVideo,
            isAutoScroll: !prevVideo.isAutoScroll,
        }));
    };

    const handlePlay = () => {
        if (!videoRef.current) {
            return;
        }
        setVideo((prevVideo) => ({ ...prevVideo, isPlay: !prevVideo.isPlay }));
        if (!isPlay) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const handleMuted = () => {
        if (!videoRef.current) {
            return;
        }
        setVideo((prevVideo) => ({ ...prevVideo, isMuted: !prevVideo.isMuted }));
        videoRef.current.setMuted(!video.isMuted);
    };

    const handleSetVolume = (currentVolume) => {
        const isMuted = currentVolume === '0' ? true : false;
        setVideo((prevVideo) => ({ ...prevVideo, isMuted }));
        if (videoRef.current) {
            videoRef.current.setVolume(currentVolume);
            videoRef.current.setMuted(isMuted);
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.setVolume('5');
            volumeRef.current.setValue('5');
            videoRef.current.setMuted(false);
            // videoRef.current.play()
            const err = videoRef.current.play();
            err.then((res) => {
                if (videoRef.current && res === 'error') {
                    videoRef.current.setMuted(true);
                    videoRef.current.play();
                    setVideo((prev) => ({ ...prev, isMuted: true }));
                }
            });
        }
    }, []);

    const handleEnded = () => {
        if (isAutoScroll) {
            // setPlay(false);
            // progressRef.current.setValue('0');
            // const nextVideo = videoWrapperRef.current.nextSibling;
            // if (!nextVideo) {
            //     return;
            // }
            // window.scrollTo({
            //     top: nextVideo.offsetTop - HEADER_HEIGHT,
            //     behavior: 'smooth',
            // });
        } else if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) {
            return;
        }

        // if (isLoading === true) {
        //     setLoading(false);
        // }
        const currentTime = videoRef.current.getCurrentTime();
        const lengthVideo = videoRef.current.getDuration();
        const currProgress = Math.round((currentTime / lengthVideo) * 100);
        if (progressRef.current) {
            progressRef.current.setValue(currProgress.toString());
        }
        setVideo((prevVideo) => ({ ...prevVideo, currentTime }));
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const duration = videoRef.current.getDuration();
            setVideo((prevVideo) => ({ ...prevVideo, duration }));
        }
    };

    const handleSeek = (currPosition) => {
        if (!videoRef.current) {
            progressRef.current.setValue('0');
            return;
        }
        if (isLoading) {
            return;
        }
        const lengthVideo = videoRef.current.getDuration();
        if (!isNaN(lengthVideo)) {
            const currentTime = (currPosition / 100) * lengthVideo;
            videoRef.current.setCurrentTime(currentTime);
        }
    };

    const renderCurrentTime = useMemo(() => formatTime(video.currentTime), [video.currentTime]);
    const renderVideoDuration = useMemo(() => formatTime(video.duration), [video.duration]);

    return (
        <div className={cx('video-wrapper')}>
            <Image className={cx('video-thumb')} src={data.thumb?.url} alt={data.description} />
            <Video
                ref={videoRef}
                className={cx('video')}
                src={data.file_url}
                preload={'auto'}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onLoadedMetadata={handleLoadedMetadata}
                // onProgress={(state) => {setLoading(true); console.log('progress')}} //loading more data
                // onSeeked={() =>  console.log(videoRef.current.buffered)}
                onStalled={() => console.log('stall')}
                // onLoadedMetaData={() => setLoading(false)}
                onWaiting={() => {
                    // console.log('lack data');
                    setLoading(true);
                }}
                onPlaying={() => {
                    // console.log('playing');
                    setLoading(false);
                }}
                onClick={handlePlay}
            />

            {isLoading && <Spinner className={cx('video-loading')} fontSize={'3.2rem'} color={'#fff'} slow />}

            <div className={cx('controls-top')}>
                <CircleButtonIcon
                    className={cx('control-btn')}
                    icon={<FontAwesomeIcon icon={faXmark} />}
                    size={40}
                    iconColor={'#fff'}
                    onClick={() => navigate(-1)}
                />
                <Search transparentStyle placeholder="Find related content" />

                <CircleButtonIcon
                    className={cx('control-btn')}
                    icon={<FontAwesomeIcon icon={faEllipsis} />}
                    size={40}
                    iconColor={'#fff'}
                />
            </div>

            <div className={cx('controls-switch')}>
                {preVideo?.uuid && (
                    <CircleButtonIcon
                        className={cx('control-btn')}
                        icon={<FontAwesomeIcon icon={faAngleUp} />}
                        size={40}
                        iconColor={'#fff'}
                        onClick={handlePreviousVideo}
                    />
                )}
                <CircleButtonIcon
                    className={cx('control-btn')}
                    icon={<FontAwesomeIcon icon={faAngleDown} />}
                    size={40}
                    iconColor={'#fff'}
                    margin="16px 0 0"
                    onClick={handleNextVideo}
                />
            </div>

            <div className={cx('controls-bottom')}>
                <CircleButtonIcon
                    className={cx('control-btn')}
                    icon={isPlay ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                    size={40}
                    iconColor={'#fff'}
                    onClick={handlePlay}
                />

                <RangeSlider ref={progressRef} className={cx('progress')} size="md" hover onInput={handleSeek} />
                <span className={cx('time-video')}>
                    {renderCurrentTime}/{renderVideoDuration}
                </span>

                <CircleButtonIcon
                    className={cx('control-btn')}
                    icon={<MiniPlayerIcon />}
                    size={40}
                    iconColor={'#fff'}
                />
                <CircleButtonIcon
                    className={cx('control-btn')}
                    icon={isAutoScroll ? <ArrowUpIcon /> : <ArrowUpSlashIcon />}
                    size={40}
                    iconColor={'#fff'}
                    margin="0 0 0 12px"
                    onClick={handleAutoScrollVideo}
                />
                <CircleButtonIcon
                    className={cx('control-btn')}
                    icon={isMuted ? <VolumeXmarkIcon /> : <VolumeIcon />}
                    size={40}
                    iconColor={'#fff'}
                    margin="0 0 0 12px"
                    onClick={handleMuted}
                />

                <div className={cx('volume-wrapper')}>
                    <RangeSlider
                        ref={volumeRef}
                        className={cx('volume')}
                        size="md"
                        initValue={'0'}
                        colorLeft={'#fff'}
                        color={'rgba(255, 255, 255, 0.34)'}
                        onInput={handleSetVolume}
                    />
                </div>
            </div>
        </div>
    );
}

VideoControls.propTypes = {
    data: PropTypes.object.isRequired,
};

export default memo(VideoControls);
