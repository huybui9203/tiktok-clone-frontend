import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './RadioButton.module.scss';
const cx = classNames.bind(styles);
const RadioButtonGroup = ({ children, label, horizontal, className }) => {
    return (
        <div className={cx('group-wrapper', className, { horizontal })}>
            <p className={cx('group-label')}>{label}</p>
            <div className={cx('group')}>{children}</div>
        </div>
    );
};

RadioButtonGroup.propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.string,
    horizontal: PropTypes.bool,
    className: PropTypes.string,
};

export default RadioButtonGroup;
