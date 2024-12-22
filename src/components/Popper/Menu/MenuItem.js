import PropTypes from 'prop-types';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
    const [mode, setMode] = useState(JSON.parse(localStorage.getItem('theme')) || 'light');
    return (
        <div className={data.switchBtn ? cx('switch-btn') : ''}>
            <Button
                leftIcon={data.icon}
                to={data.to}
                className={cx('menu-item', data.separate ? 'separate' : '')}
                onClick={onClick}
            >
                {data.title}
            </Button>

            {data.switchBtn && (
                <Button
                    switchMode
                    className={mode}
                    onClick={() => {
                        setMode((prev) => {
                            const theme = prev === 'dark' ? 'light' : 'dark';
                            localStorage.setItem('theme', JSON.stringify(theme));
                            return theme;
                        });
                    }}
                ></Button>
            )}
        </div>
    );
}

MenuItem.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};

export default MenuItem;
