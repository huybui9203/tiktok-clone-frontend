import PropTypes from 'prop-types';
import styles from './RadioButton.module.scss';
const RadioButton = ({ name, value, checked, onChange }) => {
    return (
        <label className={styles.wrapper}>
            <input
                className={styles.input}
                type="radio"
                value={value}
                name={name}
                checked={checked}
                onChange={onChange}
                hidden
            />
            <div className={styles.radio}></div>
            <span className={styles.value}>{value}</span>
        </label>
    );
};

RadioButton.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    checked: PropTypes.bool,
    onchange: PropTypes.func,
};

export default RadioButton;
