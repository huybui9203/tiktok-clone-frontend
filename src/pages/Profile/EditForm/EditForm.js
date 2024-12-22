import { useEffect, useReducer, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import FormGroup from '~/components/FormGroup';
import EditorAvatar from './EditorAvatar';
import CircleButtonIcon from '~/components/CircleButtonIcon';
import editFormReducer, { initState } from './editFormReducer';
import { useAuth, useConfirm, useDebounce, useToast } from '~/hooks';
import * as actions from './actions';
import styles from './EditForm.module.scss';
import { linkToRoute as to } from '~/config/routes';
import * as userService from '~/services/userService';
import { useQuery } from '@tanstack/react-query';
import Spinner from '~/components/Spinner';
import { profileKeys } from '../queries';

const cx = classNames.bind(styles);

const LIMIT_TEXT = 80;
const CONFIRM = true;
const usernameLength = {
    MIN: 2,
    MAX: 24,
};

const EditForm = ({ onCancel = () => {} }) => {
    const [textCount, setTextCount] = useState(0);
    const [isShowEditorAvatar, setShowEditorAvatar] = useState(false);
    const [imgSrc, setImgSrc] = useState(null);
    const [preview, setPreview] = useState(null);
    const [formData, dispatch] = useReducer(editFormReducer, initState);

    const {
        authState: { user },
    } = useAuth();

    const toast = useToast();
    const confirm = useConfirm();

    const inputFileRef = useRef(null);
    const textAreaRef = useRef(null);
    const formEditorRef = useRef(null);

    // const set = useRef(new Set())
    // set.current.add(preview)
    // console.log('>>>>>>', set.current)

    const handleChangeImage = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        setImgSrc(URL.createObjectURL(e.target.files[0]));
        setShowEditorAvatar(true);
    };

    const handleChooseImage = () => {
        const inputFile = inputFileRef.current;
        if (inputFile) {
            inputFile.click();
        }
    };

    const handleResetInputFile = () => {
        inputFileRef.current.value = '';
    };

    const handleSetAvatar = () => {
        if (inputFileRef.current) {
            dispatch(actions.chooseFile(inputFileRef.current.files[0]));
        }
    };

    const [debouncedUsername] = useDebounce(formData.username.value, 800);

    const { data, isFetching } = useQuery({
        queryKey: profileKeys.username(debouncedUsername.trim()),
        queryFn: () => userService.checkValidUsername(debouncedUsername.trim()),
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        staleTime: 10 * 1000,
        gcTime: 5 * 60 * 1000,
        enabled: !!(
            debouncedUsername &&
            debouncedUsername.length >= usernameLength.MIN &&
            debouncedUsername.length <= usernameLength.MAX &&
            debouncedUsername.trim() !== user?.data?.username
        ),
    });

    const handleChangeUsername = async (value) => {
        if (value.startsWith(' ')) {
            return;
        }
        dispatch(actions.changeUsername(value));
    };

    const handleChangeNickname = (value) => {
        dispatch(actions.changeNickname(value));
    };

    const handleChangeBio = (e) => {
        const bio = e.target.value;
        if (bio.length <= LIMIT_TEXT) {
            dispatch(actions.changeUserBio(bio));
            setTextCount(bio.length);
        }
    };

    const handleCancel = () => {
        URL.revokeObjectURL(imgSrc);
        URL.revokeObjectURL(preview);
        onCancel();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.isValidated) {
            const body = {
                // username: formData.username.value.trim(),
                // nickname: formData.nickname.value.trim(),
                // bio: formData.bio.value.trim(),
            };
            if (formData.username.value.trim() !== user?.data?.username) {
                body.username = formData.username.value.trim();
            }
            if (formData.nickname.value.trim() !== user?.data?.nickname) {
                body.nickname = formData.nickname.value.trim();
            }
            if (formData.bio.value.trim() !== user?.data?.bio) {
                body.bio = formData.bio.value.trim();
            }
            if (formData.avatar.value) {
                body.image = formData.avatar.value;
                body.publicId = user?.data?.avatar && user?.data?.avatar?.public_id;
            }

            let choose = CONFIRM;
            if (body.nickname) {
                choose = await confirm({
                    confirmation: 'Set nickname?',
                    description: 'You can only change your nickname once every 7 days',
                    confirmBtnLabel: 'Confirm',
                    btnHorizontal: true,
                });
            }

            if (choose !== CONFIRM) {
                return;
            }

            const res = await userService.updateProfile(user?.data?.id, body);
            if (!res) {
                toast.show('Something went wrong');
            } else {
                await toast.show('update profile successfull');
                window.location.reload();
            }
        }
    };

    useEffect(() => {
        //set default from value
        dispatch(
            actions.initFormData({
                username: user.data?.username,
                nickname: user.data?.nickname,
                bio: user.data?.bio || '',
                // avatar: user?.data?.avatar?.lg
            }),
        );
        setTextCount(user.data.bio ? user.data.bio.length : 0);
    }, []);

    useEffect(() => {
        return () => URL.revokeObjectURL(preview);
    }, [preview]);

    useEffect(() => {
        return () => URL.revokeObjectURL(imgSrc);
    }, [imgSrc]);

    useEffect(() => {
        const observerRefValue = formEditorRef.current;
        disableBodyScroll(observerRefValue);
        return () => {
            if (observerRefValue) {
                enableBodyScroll(observerRefValue);
            }
        };
    }, []);

    useEffect(() => {
        if (data && data.value === formData.username.value) {
            dispatch(actions.checkValidUsername(data.is_valid));
        }
    }, [data, formData.username.value]);

    return (
        <div className={cx('wrapper')} ref={formEditorRef}>
            <form onSubmit={handleSubmit} id="form">
                <h1 className={cx('heading')}>Edit profile</h1>
                <div className={cx('body')}>
                    <div className={cx('item')}>
                        <div className={cx('label')}>Profile photo</div>
                        <div className={cx('avatar')}>
                            <Avatar
                                src={preview || user?.data?.avatar?.lg}
                                alt={user?.data?.nickname}
                                width="96px"
                                onClick={handleChooseImage}
                            />
                            <CircleButtonIcon
                                onClick={handleChooseImage}
                                type="button"
                                className={cx('btn-edit')}
                                size={32}
                                icon={<FontAwesomeIcon icon={faPenToSquare} />}
                            />
                            <input
                                ref={inputFileRef}
                                tabIndex="-1"
                                type="file"
                                accept=".jpg,.jpeg,.png,.tiff,.heic,.webp"
                                hidden
                                onChange={handleChangeImage}
                            />
                        </div>
                    </div>
                    <div className={cx('item')}>
                        <div className={cx('label')}>Username</div>
                        <div className={cx('field')}>
                            {isFetching && <Spinner className={cx('loading')} fontSize="1.8rem" />}
                            <FormGroup
                                autoCheckValid
                                customInputClass={cx('input')}
                                required
                                placeholder="Username"
                                error={!formData.username.isValid}
                                errorMessage={
                                    formData.username.value.length < usernameLength.MIN
                                        ? `Include at least ${usernameLength.MIN} characters in your username`
                                        : formData.username.value.length > usernameLength.MAX
                                        ? `Maximum ${usernameLength.MAX} characters`
                                        : "This username isn't available. Please enter a new one"
                                }
                                hiddenIconSuccess={!formData.username.isLastChecked}
                                value={formData.username.value}
                                onChange={handleChangeUsername}
                            />

                            <p className={cx('description-field')}>
                                www.tiktok.com{to.profile(formData.username.value)}
                            </p>
                            <p className={cx('description-field')}>
                                Usernames can only contain letters, numbers, underscores, and periods. Changing your
                                username will also change your profile link.
                            </p>
                        </div>
                    </div>
                    <div className={cx('item')}>
                        <div className={cx('label')}>Name</div>
                        <div className={cx('field')}>
                            <FormGroup
                                customInputClass={cx('input')}
                                placeholder="Name"
                                value={formData.nickname.value}
                                onChange={handleChangeNickname}
                            />
                            <p className={cx('description-field')}>
                                Your nickname can only be changed once every 7 days.
                            </p>
                        </div>
                    </div>
                    <div className={cx('item')}>
                        <div className={cx('label')}>Bio</div>
                        <div className={cx('field')}>
                            <textarea
                                ref={textAreaRef}
                                className={cx('text-area')}
                                placeholder="Bio"
                                value={formData.bio.value}
                                onChange={handleChangeBio}
                            />
                            <p className={cx('text-count', { active: textCount === LIMIT_TEXT })}>
                                {textCount}/{LIMIT_TEXT}
                            </p>
                        </div>
                    </div>
                </div>
                <footer className={cx('footer')}>
                    <Button outline onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!formData.isValidated} primary>
                        Save
                    </Button>
                </footer>
            </form>

            {isShowEditorAvatar && (
                <EditorAvatar
                    imgSrc={imgSrc}
                    onClose={() => setShowEditorAvatar(false)}
                    onResetInputFile={handleResetInputFile}
                    onSetPreview={(previewAvt) => setPreview(previewAvt)}
                    onSetAvatar={handleSetAvatar}
                />
            )}
        </div>
    );
};

EditForm.propTypes = {
    onCancel: PropTypes.func,
};

export default EditForm;
