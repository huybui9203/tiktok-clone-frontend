import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    children,
    primary = false,
    secondary=false,
    outline = false,
    outlinePrimary = false,
    disabled = false,
    round = false,
    switchMode = false,
    className = false,
    leftIcon = false,
    rightIcon = false,
    type = 'button', //only for button | one of types: 'button', 'reset', 'submit
    size = 'md', // one of sizes :  sm(small), md(medium), lg(large)
    onClick = () => {},
    ...rest
}) {
    let Comp = 'button';

    const props = {
        ...rest,
    };

    //remove event
    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    if (href) {
        Comp = 'a';
        props.href = href;
    } else if (to) {
        Comp = Link;
        props.to = to;
    }

    if(Comp === 'button') {
        props.type = type
    }

    const classNames = cx('wrapper', size, {
        ['switch-mode']: switchMode,
        [className]: className, //lay value cua className lam key
        primary,
        secondary,
        outline,
        outlinePrimary,
        disabled,
        round,
    });

    const handleClick = (e) => {
        if (disabled) {
            return;
        }
        e.stopPropagation();
        onClick(e);
    };

    return (
        <Comp className={classNames} {...props} onClick={handleClick}>
            {leftIcon && <span>{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span>{rightIcon}</span>}
        </Comp>
    );
}

Button.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    children: PropTypes.node, //switch mode not need children
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    outline: PropTypes.bool,
    outlinePrimary: PropTypes.bool,
    disabled: PropTypes.bool,
    round: PropTypes.bool,
    switchMode: PropTypes.bool,
    className: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    type: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;
