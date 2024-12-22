import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import UploadResult from './UploadResult';
import * as indexedDB from '~/utils/indexedDB';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';

import styles from './Upload.module.scss';
import { useToast } from '~/hooks';
const cx = classNames.bind(styles);

function Upload() {
    const [file, setFile] = useState(null);
    const [isExistedFile, setExistedFile] = useState(false);
    const inputRef = useRef(null);
    const isShowElertWhenLeave = useRef(false);
    const isDBReady = useRef(false);
    const toast = useToast();

    const handleSelectVideo = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleUploadVideo = async (e, options = { action: 'add' }) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setFile(e.target.files[0]);
        if (!isDBReady.current) {
            return;
        }
        if (options.action === 'add') {
            try {
                const id = Date.now();
                await indexedDB.addData(indexedDB.VIDEO_STORE, { id, file: e.target.files[0] });
                localStorage.setItem('draft_video_key', id);
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message);
                } else {
                    console.log('Something went wrong');
                }
            }
        } else if (options.action === 'update') {
            try {
                let key = JSON.parse(localStorage.getItem('draft_video_key'));
                if (!key) {
                    const listFileExisted = await indexedDB.getStoreData(indexedDB.VIDEO_STORE);
                    if (!listFileExisted || listFileExisted?.length === 0) {
                        return;
                    }
                    key = listFileExisted.at(-1)?.id;
                }

                await indexedDB.updateData(indexedDB.VIDEO_STORE, { id: key, file: e.target.files[0] }, key);
            } catch (err) {
                alert('Error');
                if (err instanceof Error) {
                    console.log(err.message);
                } else {
                    console.log('Something went wrong');
                }
            }
        }
    };

    const handleContinueEdit = async () => {
        if (!isDBReady.current) {
            return;
        }
        //get draft file
        try {
            const listFileExisted = await indexedDB.getStoreData(indexedDB.VIDEO_STORE);
            if (!listFileExisted || listFileExisted?.length === 0) {
                return;
            }
            setFile(listFileExisted.at(-1)?.file);
            isShowElertWhenLeave.current = true;
        } catch (error) {
            toast.show('Something went wrong');
        }
    };

    const handleDiscardEdit = async () => {
        //remove draft file
        try {
            let key = JSON.parse(localStorage.getItem('draft_video_key'));
            if (!key) {
                const listFileExisted = await indexedDB.getStoreData(indexedDB.VIDEO_STORE);
                if (!listFileExisted || listFileExisted?.length === 0) {
                    return;
                }
                key = listFileExisted.at(-1)?.id;
            }

            await indexedDB.deleteData(indexedDB.VIDEO_STORE, key);
            setExistedFile(false);
        } catch (error) {
            toast.show('Something went wrong');
        }
    };

    useEffect(() => {
        const connectIndexDB = async () => {
            try {
                isDBReady.current = await indexedDB.init();

                const hasData = await indexedDB.checkIfStoreHasData(indexedDB.VIDEO_STORE);

                setExistedFile(hasData);
            } catch (error) {
                console.log(error);
            }
        };
        connectIndexDB();

        return () => {
            if (isDBReady.current) {
                if (isShowElertWhenLeave.current) {
                    //Warning about browser shutdown when use indexedDB
                    alert('Your changes may be not saved');
                }
                indexedDB.close();
            }
        };
    }, []);

    return (
        <>
            {file ? (
                <UploadResult file={file} changeFile={handleUploadVideo} />
            ) : (
                <div className={cx('container')}>
                    <div className={cx('wrapper')}>
                        {isExistedFile && (
                            <div className={cx('notify')}>
                                <div>
                                    <FontAwesomeIcon className={cx('warning-icon')} icon={faTriangleExclamation} />
                                    <span className={cx('notify-text')}>
                                        A video you were editing wasn’t saved. Continue editing?
                                    </span>
                                </div>
                                <button className={cx('notify-button')} onClick={handleDiscardEdit}>
                                    Discard
                                </button>
                                <button className={cx('notify-button')} onClick={handleContinueEdit}>
                                    Continue
                                </button>
                            </div>
                        )}
                        <div className={cx('select-video-wrapper')} onClick={handleSelectVideo}>
                            <input ref={inputRef} type="file" accept="video/*" onChange={handleUploadVideo} hidden />
                            <FontAwesomeIcon className={cx('icon-upload')} icon={faCloudArrowUp} />
                            <p className={cx('upload-title')}>Select video to upload</p>
                            <p className={cx('upload-text')}>Or drag and drop it here</p>
                            <Button primary className={cx('button-upload')} onClick={handleSelectVideo}>
                                Select video
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Upload;
