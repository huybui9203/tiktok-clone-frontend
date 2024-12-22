import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SelectGroup.module.scss';

const cx = classNames.bind(styles);

function SelectGroup({
    children,
    label = '',
    helperText = '',
    direction = 'horizontal',
    error = false,
    errorMessage = '',
}) {
    // direction: horizontal | vertical
    return (
        <div className="">
            <p className={cx('label')}>{label}</p>
            <div className={cx('select-group', direction, {error})}>{children}</div>
            {error ? (
                <span className={cx('error-message')}>{errorMessage}</span>
            ) : (
                <span className={cx('helper-text')}>{helperText}</span>
            )}
        </div>
    );
}

SelectGroup.propTypes = {
    children: PropTypes.node.isRequired,
    label: PropTypes.string,
    helperText: PropTypes.string,
    direction: PropTypes.string,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
};

export default SelectGroup;
