import PropTypes from 'prop-types';
import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import Avatar from '~/components/Avatar';
import { useAuth, useStore } from '~/hooks';
import { showForm } from '~/store/actions';
import { linkToRoute as toProfile } from '~/config/routes';

const cx = classNames.bind(styles);

function MenuItem({ data }) {
    const { title, to, icon, hasAvatar } = data;
    const { authState } = useAuth();
    const currentUser = authState.user;
    const avatar = currentUser && hasAvatar && (
        <Avatar className={cx('user-avt')} src={currentUser.data?.avatar?.sm} alt={currentUser.data?.nickname} width="24px" />
    );

    const { dispatch } = useStore();

    return (
        <NavLink
            className={(nav) =>
                cx('menu-item', {
                    active: nav.isActive,
                })
            }
            to={currentUser && hasAvatar ? toProfile.profile(currentUser.data?.username) : to}
            end={avatar}
            onClick={(e) => {
                if(!currentUser && hasAvatar) {
                    e.preventDefault()
                    dispatch(showForm())
                }
            }}
        >
            {({ isActive }) => (
                //children
                <>
                    <span className={cx('icon')}>
                        {/* voi cách icon là mảng: */}
                        {Array.isArray(icon) ? (isActive ? icon.slice(-1) : icon.slice(0, 1)) : avatar || icon}

                        {/* voi cach icon là obj: */}
                        {/* {icon.active ? (isActive ? icon.active : icon.default) : icon} */}
                    </span>
                    <span className={cx('title')}>{title}</span>
                </>
            )}
        </NavLink>
    );
}

MenuItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default memo(MenuItem);
