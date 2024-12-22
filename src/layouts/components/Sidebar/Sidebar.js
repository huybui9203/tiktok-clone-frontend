import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import classNames from 'classnames/bind';

import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu';
import { SuggestedAccounts, FollowingAccounts } from './UserAccounts';
import * as followService from '~/services/followService';
import * as userService from '~/services/userService';
import { menu, links, INIT_PAGE, PER_PAGE, LIMIT_PER_PAGE } from './constants';
import Links from './Links';
import Image from '~/components/Image';
import { useAuth, useStore } from '~/hooks';
import Button from '~/components/Button';
import { actions } from '~/store';

const cx = classNames.bind(styles);

function Sidebar() {
    const [view, setView] = useState({ page: INIT_PAGE, per_page: PER_PAGE });
    const [page, setPage] = useState(INIT_PAGE);

    // const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [loadAll, setLoadAll] = useState(false);
    const [isLoadSuggested, setIsLoadSuggested] = useState(false);
    const [isLoadFollowing, setIsLoadFollowing] = useState(false);
    const listAccounts = useRef([]);
    const listFollowings = useRef([]);
    const totalPage = useRef();

    const { dispatch } = useStore();
    const { authState } = useAuth();
    const currentUser = authState.user;

    const menuValue = useMemo(() => {
        return menu.map((item, index) => {
            return <MenuItem key={index} data={item} />;
        });
    }, []);

    // useEffect(() => {
    //     let ignore = false;
    //     const fetchData = async () => {
    //         setIsLoadSuggested(false);
    //         const users = await userService.getSuggested(view);
    //         setIsLoadSuggested(true);
    //         // console.log('eff done');
    //         if (!ignore) {
    //             setSuggestedUsers((preUser) => {
    //                 listAccounts.current = [...preUser, ...users];
    //                 return [...preUser, ...users];
    //             });
    //         }
    //     };
    //     fetchData();
    //     // console.log('eff');

    //     return () => (ignore = true);
    // }, [view]);

    // useEffect(() => {
    //     if (!currentUser) {
    //         return;
    //     }
    //     let ignore = false;
    //     const fetchData = async () => {
    //         setIsLoadFollowing(false);
    //         const data = await followService.getFollowing({ page });
    //         setIsLoadFollowing(true);

    //         if (!data) {
    //             return;
    //         }
    //         const users = data.data;
    //         totalPage.current = data.meta.pagination.total_pages;

    //         if (!ignore) {
    //             setFollowingUsers((preUser) => {
    //                 listFollowings.current = [...preUser, ...users];
    //                 return [...preUser, ...users];
    //             });
    //         }
    //     };

    //     fetchData();

    //     return () => (ignore = true);
    // }, [page, currentUser]);

    // const handleViewSuggestedChange = useCallback(
    //     (isSeeAll) => {
    //         // console.log('change');
    //         if (!loadAll) {
    //             setView({ page: INIT_PAGE + 1, per_page: LIMIT_PER_PAGE });
    //             setLoadAll(true);
    //         } else {
    //             // isSeeAll
    //             //     ? setSuggestedUsers(listAccounts.current.slice(0, 5))
    //             //     : setSuggestedUsers(listAccounts.current.slice());
    //         }
    //     },
    //     [loadAll],
    // );

    // const handleViewFollowChange = useCallback(
    //     (isSeeAll) => {
    //         if (page + 1 <= totalPage.current) {
    //             setPage(page + 1);
    //         } else {
    //             isSeeAll
    //                 ? setFollowingUsers(listFollowings.current.slice(0, 5))
    //                 : setFollowingUsers(listFollowings.current.slice());
    //         }
    //     },
    //     [page],
    // );

    const listLink = useMemo(() => {
        return links.map((item, index) => {
            return <Links key={index} data={item} />;
        });
    }, []);

    const handleShowLoginForm = () => {
        dispatch(actions.showForm());
    };

    // console.log('suggest', suggestedUsers);

    return (
        <aside className={cx('wrapper')}>
            <Menu>{menuValue}</Menu>
            {currentUser ? (
                <>
                    <section className={cx('section')}>
                        <SuggestedAccounts
                            // label="Suggested accounts"
                            // data={suggestedUsers?.pages}
                            // isLoad={isLoadSuggested}
                            // onViewChange={handleViewSuggestedChange}
                            // isPending={isPending}
                        />
                    </section>
                    <section className={cx('section')}>
                        <FollowingAccounts
                            // label="Following accounts"
                            // type="following"
                            // currPage={page}
                            // totalPage={totalPage.current}
                            // data={followingUsers}
                            // isLoad={isLoadFollowing}
                            // onViewChange={handleViewFollowChange}
                        />
                    </section>
                </>
            ) : (
                <div className={cx('section')}>
                    <Button className={cx('btn-login')} outlinePrimary size="lg" onClick={handleShowLoginForm}>
                        Log in
                    </Button>
                </div>
            )}

            <section className={cx('section')}>
                <a
                    className={cx('wrapper-img')}
                    href="https://effecthouse.tiktok.com/download?utm_campaign=ttweb_entrance_v1&utm_source=tiktok_webapp_main"
                    target={'_blank'}
                    rel={'noopener'}
                >
                    <Image
                        className={cx('img')}
                        src="https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/8152caf0c8e8bc67ae0d.png"
                        alt="create-tiktok"
                    />
                    <h4 className={cx('label')}>Create TikTok effects, get a reward</h4>
                </a>
                {listLink}
                <span className={cx('copyright')}>&copy; 2024 TikTok</span>
            </section>
        </aside>
    );
}

export default Sidebar;
