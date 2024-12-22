import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import styles from './CheckBox.module.scss';

const CheckBox = ({ name, value, checked, onChange }) => {
    return (
        <label className={styles.wrapper}>
            <input
                className={styles.input}
                type="checkbox"
                value={value}
                name={name}
                checked={checked}
                onChange={onChange}
                hidden
            />
            <FontAwesomeIcon className={styles.checkbox} icon={faSquare} />
            <FontAwesomeIcon className={styles.active} icon={faSquareCheck} />
            <span className={styles.value}>{value}</span>
        </label>
    );
};

CheckBox.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};
export default CheckBox;
