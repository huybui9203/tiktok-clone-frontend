import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCloudArrowUp, faRotate } from '@fortawesome/free-solid-svg-icons';
import images from '~/assets/images';
import Modal from '~/components/Modal';
import Spinner from '~/components/Spinner';
import Button from '~/components/Button';
import EditCoverImage from './EditCoverImage';
import styles from './UploadResult.module.scss';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import Image from '~/components/Image';
import Select from '~/components/Select';
import RadioButton, { RadioButtonGroup } from '~/components/RadioButton';
import CheckBox, { CheckBoxGroup } from '~/components/CheckBox';
import { useBeforeUnload, useLocation, useNavigate } from 'react-router-dom';
import convertBytesToMegaBytes from '~/utils/convertBytesToMegaBytes';
import formatSeconds from '~/utils/formatSeconds';
import { ContentState } from 'draft-js';
import * as videoService from '~/services/videoService';
import { useConfirm, useToast } from '~/hooks';

const cx = classNames.bind(styles);

const schedule = {
    NOW: 'Now',
    SCHEDULE: 'Schedule',
};
const ALLOWS = ['Comment', 'Duet', 'Stitch'];
const viewable = {
    EVERYONE: { label: 'Everyone', value: 'public' },
    FRIENDS: { label: 'Friends', value: 'friends' },
    ONLY_YOU: { label: 'Only you', value: 'private' },
};
const chunkSize = 3 * 1024 * 1024; //3MB
const UploadResult = ({ file: videoFile, changeFile }) => {
    const [video, setVideo] = useState(null);
    const [coverImage, setCoverImage] = useState({ blob: null, isLoading: false, file: null });
    const [isShowEditCover, setShowEditCover] = useState(false);
    const [isShowCancelBtn, setShowCancelBtn] = useState(true);
    const [uploadProgress, setUploadProgress] = useState({
        loaded: 0,
        timeLeft: 0,
        percent: 0,
        chunkLoaded: -1,
        uploadId: '',
        totalChunks: Math.ceil(videoFile?.size / chunkSize),
    });

    const [videoData, setVideoData] = useState(null);
    const [editorState, setEditorState] = useState(() =>
        EditorState.createWithContent(
            ContentState.createFromText(videoFile?.name?.slice(0, videoFile?.name?.lastIndexOf('.'))),
        ),
    );

    const confirm = useConfirm();
    const toast = useToast();

    const autoUpload = useRef(true);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const inputRef = useRef(null);
    const editorRef = useRef(null);
    const controller = useRef(null);

    if (!controller.current) {
        controller.current = new AbortController();
    }

    const [formData, setFormData] = useState({
        viewable: viewable.EVERYONE.value,
        timePostVideo: schedule.NOW,
        allows: [...ALLOWS],
    });

    const description = editorState.getCurrentContent().getPlainText();

    // const set = useRef(new Set());
    // set.current.add(coverImage.blob + '-' + video);

    // console.log(Array.from(set.current));

    const handleReplaceFile = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    console.log(uploadProgress);

    const handleCancelUpload = async () => {
        if (
            await confirm({
                confirmation: 'Sure you want to cancel your upload?',
                description: 'Any edits to your current upload will not be saved.',
                confirmBtnLabel: 'Yes',
                cancelBtnLabel: 'No',
                btnHorizontal: true,
                wrapperClassName: cx('confirm'),
                btnContainerClassName: cx('confirm-btns'),
                confirmationClassName: cx('confirm-msg'),
                descriptionClassName: cx('confirm-description'),
                btnHeight: '40px',
                btnWidth: '108px',
            })
        ) {
            setShowCancelBtn(false);
            controller.current?.abort();

            // const res = await videoService.removeExistVideo({
            //     chunk: uploadProgress.chunkLoaded + 1,
            //     uploadId: uploadProgress.uploadId,
            // });

            // if(!res) {
            //     alert('something went wrong')
            // } else {

            // }
        }
    };

    const handleContinueUpload = async () => {
        setShowCancelBtn(true);
        let currentChunk = uploadProgress.chunkLoaded + 1;
        controller.current = new AbortController();

        console.log('CONTINUE:', uploadProgress);
        for (let i = currentChunk; i < uploadProgress.totalChunks; i++) {
            await handleAutoUpload(currentChunk, uploadProgress.uploadId);
            currentChunk++;
        }
    };

    const handleEditorChange = (editorState) => {
        setEditorState(editorState);
    };

    const handleCheckedAllows = (e) => {
        const isChecked = e.target.checked;
        setFormData((prev) => {
            let allows = [...prev.allows];
            if (isChecked) {
                allows.push(e.target.value);
            } else {
                allows = allows.filter((value) => value !== e.target.value);
            }
            return { ...prev, allows };
        });
    };

    const handlePostVideo = async () => {
        const defaultMusic = `original sound - ${'buiquanghuy'}`;
        const bodyData = {
            ...formData,
            allows: formData.allows.map((item) => item.toLocaleLowerCase()),
            description,
            image: coverImage.file,
            // video: videoFile,
            music: { name: defaultMusic },
            videoData,
        };
        console.log(bodyData);
        const res = await videoService.postVideo(bodyData);
        if (!res) {
            toast.show('Somthing went wrong');
        } else {
            toast.show('Post sucessfully');
        }
    };

    const handleDiscard = async () => {};

    const chunkProgress = 100 / uploadProgress.totalChunks;

    const handleAutoUpload = async (currentChunk, uploadId) => {
        const startTime = Date.now();
        const handleProgress = ({ loaded, total }) => {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - startTime) / 1000; // s
            const uploadSpeed = loaded / elapsedTime; // bytes/s
            const totalLoaded = currentChunk * chunkSize + loaded;
            const remainBytes = videoFile?.size - totalLoaded;
            const estimatedTimeLeft = formatSeconds(remainBytes / uploadSpeed).toMinutes();
            let percent = (currentChunk * chunkProgress + (loaded / total) * chunkProgress).toFixed(2);
            percent = percent % 1 === 0 ? parseFloat(percent) : percent;
            console.log('PROGRESS:', percent, { loaded, total, currentChunk, estimatedTimeLeft });

            setUploadProgress((prev) => {
                if (prev.percent === chunkProgress * (currentChunk + 1)) {
                    return { ...prev, loaded: totalLoaded, timeLeft: estimatedTimeLeft };
                }
                return { ...prev, loaded: totalLoaded, timeLeft: estimatedTimeLeft, percent };
            });
        };

        const chunkVideoFile = new File(
            [videoFile?.slice(currentChunk * chunkSize, Math.min((currentChunk + 1) * chunkSize, videoFile?.size))],
            `part${currentChunk}.mp4`,
            { type: 'video/mp4' },
        );

        const res = await videoService.uploadVideo(
            { video: chunkVideoFile, totalChunks: uploadProgress.totalChunks },
            handleProgress,
            {
                signal: controller.current.signal,
                uploadId,
                chunk: currentChunk,
            },
        );
        if (!res) {
            return;
        }
        if (res.phase === 'finished') {
            const data = res.data;
            setVideoData({
                publicId: data.public_id,
                size: data.bytes,
                format: data.format,
                width: data.width,
                height: data.height,
                url: data.secure_url,
                duration: data.duration,
            });
        }

        let percent = (chunkProgress * (currentChunk + 1)).toFixed(2);
        percent = percent % 1 === 0 ? parseFloat(percent) : percent;
        setUploadProgress((prev) => ({ ...prev, percent, chunkLoaded: currentChunk ?? -1 })); //if sudden increase in network speed make request completed and onUploadProgress hasn't finished
        console.log('CHUNK', currentChunk);
    };

    useEffect(() => {
        let currentChunk = 0;
        const uploadId = Date.now() + '-' + Math.round(Math.random() * 1e9);
        setUploadProgress((prev) => {
            if (!prev.uploadId) {
                return { ...prev, uploadId };
            }
            return prev;
        });
        if (autoUpload.current) {
            const uploadChunk = async () => {
                for (let i = 0; i < uploadProgress.totalChunks; i++) {
                    await handleAutoUpload(currentChunk, uploadId);
                    currentChunk++;
                }
            };
            uploadChunk();
        }

        return () => {
            autoUpload.current = false;
        };
    }, []);

    useEffect(() => {
        if (!videoFile) {
            return;
        }
        //reset upload progress
        setUploadProgress((prev) => ({ ...prev, loaded: 0, timeLeft: 0, percent: 0 }));

        //set default description
        const videoFileName = videoFile?.name;
        const defaultDescription = videoFileName?.slice(0, videoFileName?.lastIndexOf('.'));
        const newEditorState = EditorState.push(editorState, ContentState.createFromText(defaultDescription));
        setEditorState(EditorState.moveFocusToEnd(newEditorState));

        //video preview
        const videoBlob = URL.createObjectURL(videoFile);
        setVideo(videoBlob);

        //generate cover
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!video || !canvas) {
            return;
        }

        const generateCoverImage = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            setCoverImage((prev) => ({ ...prev, isLoading: true }));
            canvas.toBlob(
                (blob) => {
                    //async
                    const file = new File([blob], 'cover.jpeg', { type: 'image/jpeg' });
                    setCoverImage({ blob: URL.createObjectURL(blob), isLoading: false, file });
                },
                'image/jpeg',
                1,
            );
        };

        video.addEventListener('seeked', generateCoverImage);

        return () => {
            video.removeEventListener('seeked', generateCoverImage);
        };
    }, [videoFile]);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(video);
        };
    }, [video]);

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(coverImage.blob);
        };
    }, [coverImage.blob]);

    useEffect(() => {
        ////Warning about browser shutdown when use indexedDB
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('status')}>
                <div className={cx('info')}>
                    <p className={cx('info-title')}>{videoFile?.name}</p>
                    <p className={cx('info-detail')}>
                        <span className={cx('info-item')}>
                            <span className={cx('info-label')}>Size:</span>
                            <span className={cx('info-value')}>{convertBytesToMegaBytes(videoFile?.size)}MB</span>
                        </span>
                        <span className={cx('info-item')}>
                            <span className={cx('info-label')}>Duration:</span>
                            <span className={cx('info-value')}>
                                {formatSeconds(videoRef.current?.duration)?.toMinutesAndSeconds()}
                            </span>
                        </span>
                    </p>
                    <div className={cx('info-progress')}>
                        <div
                            className={cx('progress-detail', {
                                complete: uploadProgress.percent == 100,
                            })}
                        >
                            {uploadProgress.percent == 100 ? (
                                <span>
                                    <FontAwesomeIcon className={cx('icon-success')} icon={faCircleCheck} />
                                    Uploaded
                                </span>
                            ) : (
                                <p>
                                    <FontAwesomeIcon icon={faCloudArrowUp} />
                                    <span className={cx('progress-loaded')}>
                                        {convertBytesToMegaBytes(uploadProgress.loaded)} MB/
                                        {convertBytesToMegaBytes(videoFile?.size)} MB
                                    </span>
                                    uploaded...
                                    <span className={cx('progress-timeLeft')}>{uploadProgress.timeLeft}</span>
                                    left
                                </p>
                            )}
                        </div>
                        <span className={cx('progress-num')}>{uploadProgress.percent}%</span>
                    </div>
                </div>

                <div
                    style={{
                        width: `${uploadProgress.percent}%`,
                    }}
                    className={cx('progress-bar', {
                        ['progress-bar-fill']: uploadProgress.percent == 100,
                    })}
                ></div>

                {uploadProgress.percent == 100 ? (
                    <Button
                        secondary
                        className={cx('button-replace')}
                        leftIcon={<FontAwesomeIcon icon={faRotate} />}
                        onClick={handleReplaceFile}
                    >
                        Replace
                    </Button>
                ) : isShowCancelBtn ? (
                    <Button secondary className={cx('button-cancel')} onClick={handleCancelUpload}>
                        Cancel
                    </Button>
                ) : (
                    <Button secondary className={cx('button-cancel')} onClick={handleContinueUpload}>
                        Continue
                    </Button>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => changeFile(e, { action: 'update' })}
                    hidden
                />
            </div>
            <div className={cx('form')}>
                <div className={cx('caption')}>
                    <p className={cx('form-label')}>Description</p>
                    <div
                        className={cx('caption-editor-wrapper')}
                        onClick={() => {
                            editorRef.current?.focus();
                            setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
                        }}
                    >
                        <div className={cx('caption-editor')}>
                            <Editor
                                editorRef={(ref) => (editorRef.current = ref)}
                                editorClassName={cx('draft-editor')}
                                toolbarHidden
                                placeholder="Share more about your video here..."
                                editorState={editorState}
                                onEditorStateChange={handleEditorChange}
                            />
                        </div>
                        <div className={cx('editor-footer')}>
                            <div></div>
                            <span className={cx('word-count')}>20/4000</span>
                        </div>
                    </div>
                </div>
                {/* <div className={cx('preview')}></div> */}
                <div className={cx('cover-wrapper')}>
                    <p className={cx('form-label')}>Cover</p>
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    <Image className={cx('cover')} src={coverImage.blob || images.noImage} alt="cover-image" />
                    <div className={cx('edit-cover-btn')} onClick={() => setShowEditCover(true)}>
                        Edit cover
                    </div>
                </div>
                <div className={cx('video-container')}>
                    <div className={cx('video-wrapper')}>
                        <p className={cx('form-label')}>Preview</p>
                        <video
                            className={cx('video')}
                            ref={videoRef}
                            src={video}
                            controls
                            onLoadedMetadata={() => (videoRef.current.currentTime = 0)}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
                <Modal open={isShowEditCover} autoHeight onClose={() => setShowEditCover(false)}>
                    <EditCoverImage
                        video={videoRef.current}
                        setCoverImage={setCoverImage}
                        onClose={() => setShowEditCover(false)}
                    />
                </Modal>

                <div className={cx('form-group', 'video-visibility')}>
                    <p className={cx('form-label')}>Who can watch this video</p>
                    <Select
                        initValue={viewable.EVERYONE.label}
                        options={Object.values(viewable).map((item) => item.label)}
                        onSelect={(label) =>
                            setFormData((prev) => {
                                const value = Object.values(viewable).find((item) => item.label === label)?.value;
                                return { ...prev, viewable: value };
                            })
                        }
                    />
                </div>

                <div className={cx('form-group')}>
                    <RadioButtonGroup horizontal label="When to post">
                        {Object.values(schedule)?.map((value, index) => (
                            <RadioButton
                                key={index}
                                name="schedule-post-video"
                                value={value}
                                checked={formData.timePostVideo === value}
                                onChange={(e) => setFormData((prev) => ({ ...prev, timePostVideo: e.target.value }))}
                            />
                        ))}
                    </RadioButtonGroup>
                </div>

                <div className={cx('form-group')}>
                    <CheckBoxGroup horizontal label="Allow users to:">
                        {ALLOWS.map((value, index) => (
                            <CheckBox
                                key={index}
                                name="allow"
                                value={value}
                                checked={formData.allows?.includes(value)}
                                onChange={handleCheckedAllows}
                            />
                        ))}
                    </CheckBoxGroup>
                </div>

                <div className={cx('form-footer', 'form-group')}>
                    <Button
                        primary
                        disabled={!description || !videoData || !formData.allows?.length === 0}
                        onClick={handlePostVideo}
                    >
                        Post
                    </Button>
                    <Button secondary onClick={handleDiscard}>
                        Discard
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UploadResult;
