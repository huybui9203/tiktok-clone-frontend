import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import styles from './Spinner.module.scss';
import { forwardRef } from 'react';

const cx = classNames.bind(styles);

const Spinner = forwardRef(({ fontSize, color, className, slow, slower, fast, faster, hidden }, ref) => {
    return (
        <div ref={ref} className={cx('contaner', className)}>
            <span
                className={cx('wrapper', {
                    slow,
                    slower,
                    fast,
                    faster,
                    hidden,
                })}
                style={{
                    color: color,
                    fontSize: fontSize,
                }}
            >
                <FontAwesomeIcon icon={faCircleNotch} />
            </span>
        </div>
    );
});

Spinner.propTypes = {
    className: PropTypes.string,
    fontSize: PropTypes.string,
    color: PropTypes.string,
    slow: PropTypes.bool,
    slower: PropTypes.bool,
    fast: PropTypes.bool,
    faster: PropTypes.bool,
    hidden: PropTypes.bool,
};

export default Spinner;
