import { useRef, useState, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styles from './Select.module.scss';

function Options({ data, onSelect }) {
    const [activeIndex, setActiveIndex] = useState(-1);
    const listOptions = useRef([]);
    const handleSelect = (value, index) => {
        listOptions.current.forEach((option) => option.classList.remove(styles.active));
        const active = listOptions.current[index];
        active.classList.add(styles.active);
        setActiveIndex(index);
        onSelect(value);
    };

    const renderOptions = useMemo(() => {
        listOptions.current = [];
        return data.map((value, index) => (
            <li
                key={index}
                ref={(liNode) => {
                    if (liNode) {
                        listOptions.current.push(liNode);
                    }
                }}
                className={styles.option}
                onClick={() => handleSelect(value, index)}
            >
                <span className={styles.value}>{value}</span>
                {activeIndex === index && <FontAwesomeIcon icon={faCheck} />}
            </li>
        ));
    }, [data, activeIndex]);

    return <ul className={styles.options}>{renderOptions}</ul>;
}

Options.propTypes = {
    data: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default memo(Options);
