import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './CircleButtonIcon.module.scss';
import { memo } from 'react';

const cx = classNames.bind(styles);

function CircleButtonIcon({
    icon,
    infoAt = { info: '', placement: 'none', fontSize: '14px' },
    size = 48,
    iconColor,
    className,
    margin = '0',
    onClick,
    disabled = false,
    ...props
}) {
    //placment : top, right, bottom, left, none(default)
    const { info, placement, fontSize } = infoAt;

    const handleClick = (e) => {
        if (disabled) {
            return;
        }
        e.stopPropagation();
        if (typeof onClick === 'function') {
            onClick(e);
        }
    };
    return (
        <button
            className={cx('button', { [`info-${placement}`]: placement, disabled })}
            style={{ margin: margin }}
            onClick={handleClick}
            {...props}
        >
            <span
                className={cx('icon-wrapper', className)}
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    color: iconColor || 'currentcolor',
                }}
            >
                {icon}
            </span>
            {info !== '' && <strong style={{ fontSize: fontSize }}>{info}</strong>}
        </button>
    );
}

CircleButtonIcon.propTypes = {
    icon: PropTypes.element.isRequired,
    infoAt: PropTypes.object,
    size: PropTypes.number,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
};

export default memo(CircleButtonIcon);
