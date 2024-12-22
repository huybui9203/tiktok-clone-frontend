import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import { Tab, Tabs } from '~/components/Tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import VideoItem from '~/components/VideoItem';
import Modal from '~/components/Modal';
import EditForm from './EditForm';
import useProfile from './hooks/useProfile';
import Spinner from '~/components/Spinner';
import { UserIconRegular } from '~/components/Icons';
import styles from './Profile.module.scss';
import { useIsVisible } from '~/hooks';
const cx = classNames.bind(styles);

const VIDEO_TAB = 1;
const LIKED_TAB = 2;

function Profile() {
    const [isShow, setIsShow] = useState(false);
    const [tabIndex, setTabIndex] = useState(VIDEO_TAB);
    const [isShowEditForm, setShowEditForm] = useState(false);
    const params = useParams();
    const isUsername = params.username.match(/^@/);

    const { isVisible, targetRef: loaderRef } = useIsVisible({
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
    });

    //get profile by username(unique)
    const {
        data: profileData,
        error,
        isPending,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useProfile(params.username.slice(1));

    const renderListVideos = useMemo(() => {
        return profileData?.pages?.map((page, index) => (
            <Fragment key={index}>
                {page?.profile?.videos?.map((video) => (
                    <VideoItem key={video.id} data={video}/>
                ))}
            </Fragment>
        ));
    }, [profileData]);

    const renderTabResult = useMemo(() => {
        switch (tabIndex) {
            case VIDEO_TAB:
                return <div className={cx('list-videos')}>{renderListVideos}</div>
            case LIKED_TAB:
                return <div>Liked videos</div>
            default:
                break;
        }
    }, [tabIndex, renderListVideos]);

    useEffect(() => {
        console.log(isVisible);
        if (isVisible && !isFetchingNextPage) {
            fetchNextPage();
        } else {
        }
    }, [fetchNextPage, isVisible]);

    if (!isUsername) {
        return <>404 Not found</>;
    }

    const handleSelectedTab = (tabIndex) => {
        setTabIndex(tabIndex);
    };

    const handleShowEditForm = () => {
        setShowEditForm(true);
    };

    const userData = profileData?.pages?.length && profileData.pages[0]?.profile;

    if (error?.status === 404) {
        return (
            <div className={cx('account-not-found')}>
                <UserIconRegular color="rgba(22, 24, 35, 0.75)" />
                <p>Couldn't find this account</p>
                <p>Looking for videos? Try browsing our trending creators, hashtags, and sounds.</p>
            </div>
        );
    } else if (error) {
        return <p>Something went wrong</p>;
    }

    return (
        <div className={cx('wrapper')}>
            {isPending ? (
                <Spinner />
            ) : (
                <>
                    <div className={cx('profile')}>
                        <Avatar width={'212px'} src={userData?.avatar?.lg} alt={userData?.nickname} />
                        <div className={cx('body')}>
                            <div className={cx('user-title')}>
                                <h1>{userData?.username}</h1>
                                <h2>{userData?.nickname}</h2>
                            </div>
                            <div className={cx('user-actions')}>
                                <Button primary onClick={handleShowEditForm}>
                                    Edit profile
                                </Button>
                            </div>
                            <div className={cx('statistic')}>
                                <span className={cx('label')}>
                                    <strong>{userData.followings_count}</strong>Following
                                </span>
                                <span className={cx('label')}>
                                    <strong>{userData.followers_count}</strong>Followers
                                </span>
                                <span className={cx('label')}>
                                    <strong>{userData.likes_count}</strong>Likes
                                </span>
                            </div>
                            <div className={cx('bio')}>{userData.bio || 'No bio yet.'}</div>
                        </div>

                        <Modal open={isShowEditForm} autoHeight onClose={() => setShowEditForm(false)}>
                            <EditForm onCancel={() => setShowEditForm(false)} data={userData} />
                        </Modal>
                    </div>
                    <div className={cx('videos')}>
                        <Tabs lineTransition onSelectedTab={handleSelectedTab}>
                            <Tab label="Videos" />
                            <Tab label="Liked" iconLeft={<FontAwesomeIcon icon={faLock} />} />
                        </Tabs>
                        {renderTabResult}
                    </div>
                </>
            )}

            <Spinner ref={loaderRef} fontSize="1.8rem" hidden={!isFetchingNextPage} />
        </div>
    );
}

export default Profile;
