import { Link, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';

import { Menu as MenuPopper } from '~/components/Popper';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Button from '~/components/Button';
import { PaperPlaneIcon, InboxIcon } from '~/components/Icons';
import Search from '~/layouts/components/Search';
import config from '~/config';
import Avatar from '~/components/Avatar';
import { MENU_ITEMS, userMenu } from './constants';
import { useAuth, useStore } from '~/hooks';
import { actions } from '~/store';

const cx = classNames.bind(styles); //gắn class(chuỗi) với class tương ứng trong file module.scss,ho tro viet class co dau gach noi

function Header() {
    // const [isShowForm, setShowForm] = useState(false);
    const { authState } = useAuth();
    const { dispatch } = useStore();
    const currentUser = authState.user;
    const userData = currentUser?.data;

    const navigate = useNavigate()
    // const handleCloseForm = () => {
    //     document.title = 'TikTok - Make Your Day';
    //     setShowForm(false);
    // };

    const handleShowForm = () => {
        dispatch(actions.showForm());
    };
    return (
        <header className={cx('wrapper')}>
            <div className={cx('logo')}>
                <Link to={config.routes.home} className={cx('logo-link')}>
                    <img src={images.logo} alt="tiktok" />
                </Link>
            </div>

            <Search />

            <div className={cx('action')}>
                {currentUser ? (
                    <>
                        <Button outline leftIcon={<FontAwesomeIcon icon={faPlus} />} onClick={() => navigate('/upload')}>
                            Upload
                        </Button>

                        <Tippy content="Messages" delay={[0, 100]}>
                            <button className={cx('action-btn')}>
                                <PaperPlaneIcon />
                            </button>
                        </Tippy>
                        
                        <Tippy content="Inbox" delay={[0, 100]}>
                            <button className={cx('action-btn')}>
                                <InboxIcon />
                                <span className={cx('notify')}>2</span>
                            </button>
                        </Tippy>
                    </>
                ) : (
                    <Button primary onClick={handleShowForm}>
                        Log in
                    </Button>
                )}

                <MenuPopper items={currentUser ? userMenu : MENU_ITEMS}>
                    {currentUser ? (
                        <Avatar className={cx('user-avatar')} src={userData.avatar?.sm} alt={userData.nickname} />
                    ) : (
                        <button className={cx('more-btn')}>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </button>
                    )}
                </MenuPopper>
            </div>
        </header>
    );
}

export default Header;
