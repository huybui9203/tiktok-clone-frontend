import classNames from 'classnames/bind';
import styles from './UploadResult.module.scss';
import { useEffect, useRef } from 'react';
import Button from '~/components/Button';

const cx = classNames.bind(styles);
let TIME = 0;
const COUNT_FRAMES = 8;
const WIDTH_LIST_FRAMEs = 384;
const HEIGHT_LIST_FRAMEs = 64;
const EditCoverImage = ({ video, setCoverImage, onClose }) => {
    const coverSelectedRef = useRef(null);
    const coversListRef = useRef(null);
    const dragRef = useRef(null);

    const drawCoverSelected = () => {
        const coverSelected = coverSelectedRef.current;
        if (!coverSelected || !video) {
            return;
        }
        coverSelected.width = video.videoWidth;
        coverSelected.height = video.videoHeight;
        const context = coverSelected.getContext('2d');

        context.drawImage(video, 0, 0, coverSelected.width, coverSelected.height);
    };

    const drawCoverList = () => {
        const coversList = coversListRef.current;
        if (!coversList || !video) {
            return;
        }
        const context = coversList.getContext('2d');
        coversList.width = WIDTH_LIST_FRAMEs;
        coversList.height = HEIGHT_LIST_FRAMEs;

        const frames = COUNT_FRAMES;
        const frameInterval = Math.floor(video.duration / frames);

        const drawFrame = (currFrame) => {
            if (currFrame >= frames) {
                return;
            }
            video.currentTime = currFrame * frameInterval;
            video.addEventListener(
                'seeked',
                () => {
                    let ratioWidthToHeight = WIDTH_LIST_FRAMEs / COUNT_FRAMES / HEIGHT_LIST_FRAMEs;

                    const imageClippedFromOriginal = {
                        x: '',
                        y: '',
                        width: '',
                        height: '',
                    };

                    if (video.videoWidth / video.videoHeight < ratioWidthToHeight) {
                        imageClippedFromOriginal.x = 0;
                        imageClippedFromOriginal.y = (video.videoHeight - video.videoWidth / ratioWidthToHeight) / 2;
                        imageClippedFromOriginal.width = video.videoWidth;
                        imageClippedFromOriginal.height = video.videoWidth / ratioWidthToHeight;
                    } else {
                        imageClippedFromOriginal.x = (video.videoWidth - ratioWidthToHeight * video.videoHeight) / 2;
                        imageClippedFromOriginal.y = 0;
                        imageClippedFromOriginal.width = ratioWidthToHeight * video.videoHeight;
                        imageClippedFromOriginal.height = video.videoHeight;
                    }

                    context.drawImage(
                        video,
                        imageClippedFromOriginal.x, //The x coordinate where to start clipping
                        imageClippedFromOriginal.y, //The y coordinate where to start clipping
                        imageClippedFromOriginal.width, //The width of the clipped image
                        imageClippedFromOriginal.height, //The height of the clipped image
                        (coversList.width / frames) * currFrame, //The x coordinate where to place the image on the canvas
                        0, //The y coordinate where to place the image on the canvas
                        coversList.width / frames,
                        coversList.height,
                    );
                    drawFrame(currFrame + 1);
                },
                { once: true },
            );
        };

        drawFrame(0);
    };

    const handleConfirm = () => {
        // const coverSelected = coverSelectedRef.current;
        // if (coverSelected) {
        //     coverSelected.toBlob(
        //         (blob) => {
        //             const selectedCoverBlob = URL.createObjectURL(blob);
        //             setCoverImage((prev) => ({ ...prev, blob: selectedCoverBlob }));
        //         },
        //         'image/jpeg',
        //         1,
        //     );
        // }
        onClose();
    };

    const handleChangeCover = (e) => {
        const frameInterval = Math.floor(video.duration / COUNT_FRAMES);
        const frameWidth = Math.floor(WIDTH_LIST_FRAMEs / COUNT_FRAMES);

        const rectCoverList = e.target.getBoundingClientRect();
        const posX = e.clientX - rectCoverList.left;
        const numOfFrameSelected = [...Array(8)]
            .map((_, i) => i)
            .reduce((pos, num) => {
                if (num * frameWidth <= posX && posX - num * frameWidth <= frameWidth) {
                    return num;
                }
                return pos;
            });
        const captureTimeAt = numOfFrameSelected * frameInterval;
        video.currentTime = captureTimeAt;
        video.addEventListener(
            'seeked',
            () => {
                drawCoverSelected();
            },
            { once: true },
        );

        const drag = dragRef.current;
        if (drag) {
            drag.style.left = posX + 'px';
        }
    };

    const handleMouseMove = (e) => {
        const rectCoverList = e.target.getBoundingClientRect();

        const drag = dragRef.current;
        if (drag) {
            drag.style.left = e.clientX - rectCoverList.left + 'px';
        }

        const frameInterval = Math.floor(video.duration / COUNT_FRAMES);
        const frameWidth = Math.floor(WIDTH_LIST_FRAMEs / COUNT_FRAMES);
        const posX = e.clientX - rectCoverList.left;
        const numOfFrameSelected = [...Array(8)]
            .map((_, i) => i)
            .reduce((pos, num) => {
                if (num * frameWidth <= posX && posX - num * frameWidth <= frameWidth) {
                    return num;
                }
                return pos;
            });
        const captureTimeAt = numOfFrameSelected * frameInterval;
        video.currentTime = captureTimeAt;
        video.addEventListener(
            'seeked',
            () => {
                drawCoverSelected();
            },
            { once: true },
        );
    };

    const handleMouseDown = (e) => {
        const coverList = coversListRef.current;
        if (!coverList) {
            return;
        }
        coverList.onmousemove = handleMouseMove;
        coverList.onmouseup = handleMouseUp;
    };

    const handleMouseUp = (e) => {
        coversListRef.current.onmousemove = null;
        coversListRef.current.onmouseup = null;
    };

    useEffect(() => {
        drawCoverSelected();
        drawCoverList();
    }, []);

    return (
        <div className={cx('edit-cover')}>
            <h1 className={cx('edit-cover-title')}>Edit cover</h1>
            <canvas ref={coverSelectedRef} className={cx('cover-preview')}></canvas>
            <div className={cx('cover-list-wrapper')}>
                <canvas
                    ref={coversListRef}
                    className={cx('cover-list')}
                    onClick={handleChangeCover}
                    onMouseDown={handleMouseDown}
                ></canvas>
                <div
                    ref={dragRef}
                    className={cx('drag-item')}
                    onMouseUp={handleMouseUp}
                    onMouseDown={handleMouseDown}
                ></div>
            </div>
            <div className={cx('edit-cover-footer')}>
                <Button primary onClick={handleConfirm}>
                    Confirm
                </Button>
            </div>
        </div>
    );
};

export default EditCoverImage;
