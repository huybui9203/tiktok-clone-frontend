import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { Wrapper as Popper } from '~/components/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faFlag, faTrashCan } from '@fortawesome/free-regular-svg-icons';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import Avatar from '~/components/Avatar';
import CommentEditor from '../CommentEditor';
import { useAuth, useConfirm, useToast } from '~/hooks';
import calcTimePublishedVideo from '~/utils/calcTimePublishedVideo';
import styles from './Comments.module.scss';
import useVideoModal from '../hooks/useVideoModal';
import { usePostComment, useUpdateCommentById, useDeleteCommentById } from './hooks';
import { mutationFns } from './queries';
import { HeartIconRegular, IconBlueCheck, HeartIconSolid } from '~/components/Icons';
import AccountPreview from '~/components/AccountPreview';
import useFollowUser from './hooks/useFollowUser';
import useUnfollowUser from './hooks/useUnfollowUser';
import { linkToRoute as to } from '~/config/routes';
const cx = classNames.bind(styles);

const CommentItem = ({ reply, data }) => {
    const [commentEditor, setCommentEditor] = useState({
        isShow: false,
        isReply: false,
        isEdit: false,
    });

    const {
        authState: { user },
    } = useAuth();

    const { videoUuid, authorId, videoId } = useVideoModal();

    // const isAuthor = data.user?.id === authorId;
    const isAuthor = data.is_author_video;
    const isCurrentUser = data.user?.id === user.data.id;

    const confirm = useConfirm();
    const toast = useToast();

    const postComment = usePostComment(videoId);
    const deleteComment = useDeleteCommentById(videoUuid);
    const updateComment = useUpdateCommentById(videoUuid, mutationFns.updateComment);
    const likeComment = useUpdateCommentById(videoUuid, mutationFns.likeComment);
    const unLikeComment = useUpdateCommentById(videoUuid, mutationFns.unLikeComment);

    const handleLikeAndUnlikeComment = () => {
        if (data.is_liked) {
            unLikeComment.mutate({ id: data.id });
        } else {
            likeComment.mutate({ id: data.id });
        }
    };

    const handlePostComment = (comment, tags=[]) => {
        postComment.mutate({comment, tags, parentId: data?.id, authorVideoId: authorId, videoId});
        // console.log({comment, tags, parentId: data?.id, authorVideoId: authorId, videoId})
    };

    const handleUpdateComment = (newComment) => {
        updateComment.mutate({ newComment, id: data.id });
    };

    const handleDeleteOrReportComment = async () => {
        if (isCurrentUser) {
            //for delete comment
            const isComfirm = await confirm({
                confirmation: 'Are you sure you want to delete this comment?',
                confirmBtnLabel: 'Delete',
            });
            if (isComfirm) {
                deleteComment.mutate({ id: data.id });
            }
        } else {
            //for report comment
            toast.show('Reported this comment');
        }
    };

    const handleClickReplyButton = () => {
        if (!commentEditor.isShow) {
            setCommentEditor({ isShow: true, isReply: true, isEdit: false });
        }
    };

    const handleClickEditButton = () => {
        if (!commentEditor.isShow) {
            setCommentEditor({ isShow: true, isReply: false, isEdit: true });
        }
    };

    const followUser = useFollowUser(videoUuid);
    const unfollowUser = useUnfollowUser(videoUuid);
    const handleFollowAndUnfollowUser = useCallback(() => {
        if (data.user.is_followed) {
            unfollowUser.mutate({ userId: data.user?.id });
        } else {
            followUser.mutate({ userId: data.user?.id });
        }
    }, [data.user?.is_followed]);

    const timePostComment = useMemo(() => {
        const createCmtTime = data.createdAt;
        const updateCmtTime = data.updatedAt;
        const createCmtTimeToDateTime = new Date(createCmtTime?.replace(' ', 'T'));
        const updateCmtTimeToDateTime = new Date(updateCmtTime?.replace(' ', 'T'));

        const isEdited = updateCmtTimeToDateTime > createCmtTimeToDateTime;
        const value = calcTimePublishedVideo(isEdited ? updateCmtTime : createCmtTime);

        return { isEdited, value };
    });

    const renderCommentContent = useMemo(
        (commentValue) => {
            commentValue = data.comment;
            if (!commentValue) {
                return;
            }
            if (!commentValue.includes('@')) {
                return commentValue;
            }
            const comentValueArray = commentValue.split('<a>').join('</a>').split('</a>');
            return comentValueArray.map((text, index) => {
                if (text.length > 0) {
                    if (text.startsWith('@')) {
                        return (
                            <Link key={index} className={cx('comment-link')} to={`/${text}`}>
                                <strong>{text}</strong>
                            </Link>
                        );
                    } else {
                        return <span key={index}>{text}</span>;
                    }
                }
            });
        },
        [data.comment],
    );
    return (
        <>
            <div className={cx('item')}>
                <div>
                    <Tippy
                        appendTo={() => document.body}
                        interactive
                        delay={[800, 600]}
                        placement="bottom-start"
                        offset={[0, 0]}
                        zIndex={1000}
                        render={(props) => {
                            return (
                                <div tabIndex={-1} {...props}>
                                    <PopperWrapper>
                                        <AccountPreview
                                            data={data.user}
                                            onFollow={handleFollowAndUnfollowUser}
                                            hideFollowBtn={isCurrentUser}
                                        />
                                    </PopperWrapper>
                                </div>
                            );
                        }}
                    >
                        <Link to={to.profile(data.user?.username)} className={cx('avatar-link')}>
                            <Avatar
                                src={data.user?.avatar?.sm}
                                alt={data.user?.nickname}
                                width={reply ? '24px' : '40px'}
                            />
                        </Link>
                    </Tippy>
                </div>

                <div className={cx('body')}>
                    <Tippy
                        appendTo={() => document.body}
                        interactive
                        delay={[800, 600]}
                        placement="bottom-start"
                        offset={[-52, 22]}
                        zIndex={1000}
                        render={(props) => {
                            return (
                                <div tabIndex={-1} {...props}>
                                    <PopperWrapper>
                                        <AccountPreview
                                            data={data.user}
                                            onFollow={handleFollowAndUnfollowUser}
                                            hideFollowBtn={isCurrentUser}
                                        />
                                    </PopperWrapper>
                                </div>
                            );
                        }}
                    >
                        <Link className={cx('name')} to={to.profile(data.user?.nickname)}>
                            <span>{data.user?.nickname}</span>
                            {data.user?.tick && <IconBlueCheck className={cx('icon-check')} />}
                            {isAuthor && (
                                <>
                                    <span>&middot;</span>
                                    <span className={cx('creator')}>Creator</span>
                                </>
                            )}
                        </Link>
                    </Tippy>

                    <p className={cx('content')}>{renderCommentContent}</p>
                    <p className={cx('sub-content')}>
                        <span className={cx('created-time')}>
                            {timePostComment.value} {timePostComment.isEdited && '(edited)'}
                        </span>
                        <span
                            className={cx('btn-reply', { active: commentEditor.isReply })}
                            onClick={handleClickReplyButton}
                        >
                            Reply
                        </span>
                        {isCurrentUser && (
                            <span
                                className={cx('btn-edit', { active: commentEditor.isEdit })}
                                onClick={handleClickEditButton}
                            >
                                Edit
                            </span>
                        )}
                    </p>
                </div>
                <div className={cx('action')}>
                    {/* wrapper tippy by div tag to fix "Interactive tippy element may not be accessible via keyboard navigation because it is not directly after the reference element in the DOM source order." */}
                    <div>
                        <Tippy
                            placement="bottom-end"
                            delay={[0, 100]}
                            interactive
                            render={(attrs) => (
                                <div className="box" tabIndex="-1" {...attrs}>
                                    <Popper className={cx('action-popper')}>
                                        <div className={cx('action-popper-btn')} onClick={handleDeleteOrReportComment}>
                                            {isCurrentUser ? (
                                                <FontAwesomeIcon
                                                    className={cx('action-popper-icon')}
                                                    icon={faTrashCan}
                                                />
                                            ) : (
                                                <FontAwesomeIcon className={cx('action-popper-icon')} icon={faFlag} />
                                            )}
                                            <span>{isCurrentUser ? 'Delete' : 'Report'}</span>
                                        </div>
                                    </Popper>
                                </div>
                            )}
                            hideOnClick={false}
                        >
                            <div className={cx('btn-more')}>
                                <FontAwesomeIcon icon={faEllipsis} />
                            </div>
                        </Tippy>
                    </div>

                    <div className={cx('btn-like')} onClick={handleLikeAndUnlikeComment}>
                        {data.is_liked ? (
                            <HeartIconSolid width="2rem" height="2rem" className={cx('icon-like-active')} />
                        ) : (
                            <HeartIconRegular />
                        )}
                        <span className={cx('like-count')}>{data.likes_count}</span>
                    </div>
                </div>
            </div>

            {commentEditor.isShow && (
                <div className={cx('comment-box')} style={{ paddingLeft: reply ? '36px' : '52px' }}>
                    {commentEditor.isReply && (
                        <CommentEditor
                            autoFocus
                            onClose={() => setCommentEditor({ isShow: false, isReply: false, isEdit: false })}
                            placeholder="Add comment..."
                            onSendComment={handlePostComment}
                            sendBtnLabel="Post"
                            hasBtnClose
                        />
                    )}
                    {commentEditor.isEdit && (
                        <CommentEditor
                            autoFocus
                            onClose={() => setCommentEditor({ isShow: false, isReply: false, isEdit: false })}
                            placeholder={'Edit comment...'}
                            onSendComment={handleUpdateComment}
                            sendBtnLabel="Update"
                            hasBtnClose
                        />
                    )}
                </div>
            )}
        </>
    );
};

CommentItem.propTypes = {
    data: PropTypes.object.isRequired,
    reply: PropTypes.bool,
};

export default CommentItem;
