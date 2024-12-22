import { useRef, forwardRef, useImperativeHandle, useState, Suspense } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Video.module.scss';

const Video = forwardRef(
    ({ className, src, fallback, errorMessage = 'something was wrong', onError = () => {}, ...props }, ref) => {
        const [isError, setError] = useState(false);
        const videoRef = useRef(null);

        const handleError = () => {
            setError(true);
            onError();
        };

        useImperativeHandle(
            ref,
            () => {
                const videoEle = videoRef.current;
                return {
                    play() {
                        return videoEle.play().catch((err) => {
                            console.log(err)
                            return 'error'
                        });
                    },

                    pause() {
                        videoEle.pause();
                    },

                    setMuted(isMuted) {
                        videoEle.muted = !!isMuted;
                    },

                    setVolume(number) {
                        if (isFinite(number) && number >= 0 && number <= 100) {
                            videoEle.volume = number / 100;
                        }
                    },

                    setCurrentTime(seconds) {
                        if (isFinite(seconds)) {
                            videoEle.currentTime = seconds;
                        }
                    },

                    getVolume() {
                        return videoEle.volume;
                    },

                    getCurrentTime() {
                        return videoEle.currentTime;
                    },

                    getDuration() {
                        return videoEle.duration;
                    },
                };
            },
            [],
        );

        return (
            <>
                <video
                    ref={videoRef}
                    className={classNames(styles.video, className)}
                    src={src}
                    muted
                    {...props}
                    onError={handleError}
                />

                {isError && (fallback || <div className={classNames(styles.error)}>{errorMessage}</div>)}
            </>
        );
    },
);

Video.propTypes = {
    className: PropTypes.string,
    src: PropTypes.string.isRequired,
    fallback: PropTypes.node,
    errorMessage: PropTypes.string,
};

export default Video;
