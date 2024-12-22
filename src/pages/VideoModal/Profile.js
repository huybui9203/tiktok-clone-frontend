import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import styles from './VideoModal.module.scss';
import Button from '~/components/Button';
import { BookmarkIcon, HeartIconSolid, IconBlueCheck, MessageIcon, ShareIcon } from '~/components/Icons';
import Avatar from '~/components/Avatar';
import CircleButtonIcon from '~/components/CircleButtonIcon';
import TextEllipse from '~/components/TextEllipse';
import calcTimePublishedVideo from '~/utils/calcTimePublishedVideo';
import { useToast } from '~/hooks';
import useLikeVideo from './hooks/useLikeVideo';
import { mutationFns } from './queries';
import useUnlikeVideo from './hooks/useUnlikeVideo';
import useFollowAuthor from './hooks/useFollowAuthor';
import useUnfollowAuthor from './hooks/useUnfollowAuthor';
import { linkToRoute as to } from '~/config/routes';

const cx = classNames.bind(styles);
const DESC_VIDEO_MAX_HEIGHT = 48; // 2 lines

function Profile({ data }) {
    const [seeMoreDesc, setSeeMoreDesc] = useState(false);
    const [hasButtonMore, setHasButtonMore] = useState(false);
    const [isAddToFavorite, setIsAddToFavorite] = useState(false);
    const videoDescRef = useRef(null);

    const followAuthor = useFollowAuthor(data.uuid)
    const unfollowUser = useUnfollowAuthor(data.uuid)
    const handleFollow = () => {
        if(data.user?.is_followed) {
            unfollowUser.mutate({userId: data.user?.id})
        } else {
            followAuthor.mutate({userId: data.user?.id})
        }
    };

    const likeVideo = useLikeVideo(data.uuid);
    const unlikeVideo = useUnlikeVideo(data.uuid)
    const handleLikeAndUnlikeVideo = useCallback(() => {
        if (data.is_liked) {
            unlikeVideo.mutate({ videoUuid: data.uuid })
        } else {
            likeVideo.mutate({ videoUuid: data.uuid });
        }
    }, [data.is_liked]);

    const handleAddToFavorite = useCallback(() => {
        setIsAddToFavorite((isAddToFavorite) => !isAddToFavorite);
    }, []);

    const toast = useToast();

    const handleCopyLinkVideo = () => {
        navigator.clipboard.writeText(data.file_url);
        toast.show('Copied');
    };

    const renderTimePostedVideo = useMemo(() => calcTimePublishedVideo(data.published_at), []);

    useLayoutEffect(() => {
        const hasMoreButton = () => videoDescRef.current.clientHeight >= DESC_VIDEO_MAX_HEIGHT;
        const hasButtonMore = videoDescRef.current && hasMoreButton();
        setHasButtonMore(hasButtonMore);
    }, []);

    const styleInfoButtonLike = useMemo(() => ({ info: data.likes_count, placement: 'left', fontSize: '14px' }));
    const styleInfoButtonComment = useMemo(() => ({ info: data.comments_count, placement: 'left', fontSize: '14px' }));
    const styleInfoButtonFavorite = useMemo(() => ({ info: data.views_count, placement: 'left', fontSize: '14px' }));
    const styleInfoButtonShare = useMemo(() => ({ info: data.shares_count, placement: 'left', fontSize: '14px' }));
    return (
        <div className={cx('profile')}>
            <div className={cx('description')}>
                <div className={cx('info-author')}>
                    <Link to={to.profile(data.user?.username)} className={cx('link-author')}>
                        {data ? (
                            <Avatar
                                className={cx('avatar')}
                                src={data.user?.avatar?.sm}
                                width={'40px'}
                                alt={data.user?.nickname}
                            />
                        ) : (
                            'placeholder'
                        )}
                        <div className={cx('body')}>
                            <p className={cx('username')}>
                                <TextEllipse>{data.user?.username}</TextEllipse>
                                {data.user?.tick && <IconBlueCheck />}
                            </p>
                            <p className={cx('nickname')}>
                                <TextEllipse>{data.user?.nickname}</TextEllipse>
                                <span>&middot;</span>
                                <span className={cx('time')}>{renderTimePostedVideo}</span>
                            </p>
                        </div>
                    </Link>

                    <Button primary={!data.user?.is_followed} outline={data.user?.is_followed} onClick={handleFollow}>
                        {data.user?.is_followed ? 'Following' : 'Follow'}
                    </Button>
                </div>

                <span
                    ref={videoDescRef}
                    className={cx('description-video')}
                    style={{ display: seeMoreDesc ? 'block' : '-webkit-box' }}
                >
                    <span></span>
                    {hasButtonMore &&
                        (seeMoreDesc || (
                            <span className={cx('btn-more')} onClick={() => setSeeMoreDesc(true)}>
                                more
                            </span>
                        ))}
                    {data.description}
                </span>
                {hasButtonMore && seeMoreDesc && (
                    <span className={cx('btn-less')} onClick={() => setSeeMoreDesc(false)}>
                        less
                    </span>
                )}

                <Link to={'/music'} className={cx('music-video')}>
                    <FontAwesomeIcon className={cx('music-icon')} icon={faMusic} />
                    {data?.music?.name}
                </Link>
            </div>

            <div className={cx('actions')}>
                <div className={cx('btn-group')}>
                    <CircleButtonIcon
                        className={cx('action-btn')}
                        icon={<HeartIconSolid width="2rem" height="2rem" />}
                        iconColor={data.is_liked && 'var(--primary)'}
                        infoAt={styleInfoButtonLike}
                        size={32}
                        onClick={handleLikeAndUnlikeVideo}
                    />
                    <CircleButtonIcon
                        className={cx('action-btn')}
                        icon={<MessageIcon width="2rem" height="2rem" />}
                        infoAt={styleInfoButtonComment}
                        size={32}
                        margin="0 0 0 20px"
                    />
                    <CircleButtonIcon
                        className={cx('action-btn')}
                        icon={<BookmarkIcon width="2rem" height="2rem" />}
                        iconColor={isAddToFavorite && '#face15'}
                        infoAt={styleInfoButtonFavorite}
                        size={32}
                        margin="0 0 0 20px"
                        onClick={handleAddToFavorite}
                    />

                    <CircleButtonIcon
                        className={cx('action-btn')}
                        icon={<ShareIcon width="2rem" height="2rem" />}
                        infoAt={styleInfoButtonShare}
                        size={32}
                        margin="0 0 0 20px"
                        onClick={() => alert()}
                    />
                </div>

                <div className={cx('link-wrapper')}>
                    <TextEllipse className={cx('link')} line={1}>
                        {data.file_url}
                    </TextEllipse>
                    <span className={cx('btn-copy')} onClick={handleCopyLinkVideo}>
                        Copy link
                    </span>
                </div>
            </div>
        </div>
    );
}

Profile.propTypes = {
    data: PropTypes.object.isRequired,
};

export default Profile;
