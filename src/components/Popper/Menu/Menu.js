import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from './Menu.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import Header from './Header';
import * as authService from '~/services/authService';
import { useConfirm, useLogout } from '~/hooks';
import { menuActions } from '~/layouts/components/Header';

const cx = classNames.bind(styles);

function Menu({ children, hideOnClick = false, items = [] }) {
    const [menu, setMenu] = useState([{ data: items }]);
    const logout = useLogout();

    const confirm = useConfirm();

    useEffect(() => {
        setMenu([{ data: items }]);
    }, [items]);

    const currMenu = menu.at(-1); //get last element of array
    const renderItems = () => {
        return currMenu.data.map((item, index) => {
            return (
                <MenuItem
                    key={index}
                    data={item}
                    onClick={(e) => {
                        const hasChildren = item.children;
                        if (hasChildren) {
                            setMenu((prev) => [...prev, item.children]);
                        } else {
                            switch (item.action) {
                                case menuActions.LOG_OUT:
                                    e.preventDefault();
                                    confirm({
                                        confirmation: 'Are you sure you want to log out?',
                                        confirmBtnLabel: 'Log out',
                                    }).then(async (choice) => {
                                        if (choice === true) {
                                            const res = await authService.logout();
                                            if (res !== undefined) {
                                                logout();
                                                // window.location.reload();
                                            }
                                        }
                                    });

                                    break;

                                default:
                                    break;
                            }
                        }
                    }}
                />
            );
        });
    };

    const handleBack = () => {
        setMenu((prev) => prev.slice(0, -1)); //a copy of array without last element
    };

    const handleReset = () => {
        setMenu((prev) => prev.slice(0, 1));
    };

    return (
        <Tippy
            interactive
            hideOnClick={hideOnClick}
            delay={[0, 700]}
            placement="bottom-end"
            render={(attrs) => (
                <div className={cx('content')} tabIndex="-1" {...attrs}>
                    <PopperWrapper className={cx('menu-list')}>
                        {menu.length > 1 && <Header title={currMenu.title} onBack={handleBack} />}
                        <div className={cx('menu-body')}>{renderItems()}</div>
                    </PopperWrapper>
                </div>
            )}
            onHide={handleReset}
        >
            {children}
        </Tippy>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    hideOnClick: PropTypes.bool,
    items: PropTypes.array,
};

export default Menu;
