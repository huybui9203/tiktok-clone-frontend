import classNames from 'classnames/bind';
import { faEllipsisV, faPlay } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as Image } from '~/components/Image';
import { Wrapper as Popper } from '~/components/Popper';
import Video from '~/components/Video';
import styles from './VideoItem.module.scss';
import TextEllipse from '../TextEllipse';
import { useEffect, useRef, useState } from 'react';
const cx = classNames.bind(styles);

const VideoItem = ({ data }) => {
    const [isShowPreview, setShowPreview] = useState(false);
    const [isMountVideo, setMountVideo] = useState(false);
    const videoRef = useRef(null);

    const handlePlayVideo = () => {
        setMountVideo(true);
    };

    const handleUnmountVideo = () => {
        setMountVideo(false);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return;
        }
        if (isMountVideo) {
            video.play();
        } else {
            video.pause();
        }
    }, [isMountVideo]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('video-wrapper')} onMouseEnter={handlePlayVideo} onMouseLeave={handleUnmountVideo}>
                <div className={cx('thumb')}>
                    <Image
                        className={cx('img')}
                        src={data?.thumb?.url}
                        alt={data?.thumb?.url}
                    />
                </div>
                {isMountVideo && (
                    <Video
                        ref={videoRef}
                        className={cx('video')}
                        src={data?.file_url}
                    />
                )}

                <p className={cx('views-count')}>
                    <FontAwesomeIcon icon={faPlay} />
                    <span>2.0M</span>
                </p>
            </div>
            <div className={cx('bottom')}>
                <TextEllipse className={cx('description')}>{data?.description}</TextEllipse>

                <Tippy
                    placement="top-end"
                    delay={[0, 100]}
                    interactive
                    onClickOutside={() => setShowPreview(false)}
                    visible={isShowPreview}
                    render={(attrs) => (
                        <div className="box" tabIndex="-1" {...attrs}>
                            <Popper>abcaef</Popper>
                        </div>
                    )}
                >
                    <span className={cx('more-btn')} onClick={() => setShowPreview(!isShowPreview)}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </span>
                </Tippy>
            </div>
        </div>
    );
};

export default VideoItem;
