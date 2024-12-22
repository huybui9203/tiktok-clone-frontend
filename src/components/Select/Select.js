import { useState } from 'react';
import PropTypes from 'prop-types';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Select.module.scss';
import { Wrapper as Popper } from '~/components/Popper';
import Options from './Options';

function Select({initValue, placeholder = '', options = [], onSelect = () => {} }) {
    const [isShowOptions, setShowOptions] = useState(false);
    const [value, setValue] = useState('');
    
    const handleChange = () => {
        setShowOptions(!isShowOptions);
    };

    const handleSelect = (value) => {
        setValue(value);
        setShowOptions(false);
        onSelect(value);
    };
    return (
        <div type="select">
            <Tippy
                placement="bottom-start"
                // hideOnClick
                onClickOutside={() => setShowOptions(false)}
                visible={isShowOptions}
                interactive
                render={(attrs) => (
                    <div className="box" tabIndex="-1" {...attrs}>
                        <Popper>
                            <Options data={options} onSelect={handleSelect} />
                        </Popper>
                    </div>
                )}
            >
                <div className={styles.wrapper} onClick={handleChange}>
                    {(!value && !initValue) && <span className={styles.placeholder}>{placeholder}</span>}
                    <span type='value'>{value || initValue || ''}</span>
                    <span>
                        <FontAwesomeIcon
                            style={{
                                transform: isShowOptions ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform .2s linear',
                            }}
                            icon={faCaretDown}
                        />
                    </span>
                </div>
            </Tippy>
        </div>
    );
}
Select.propTypes = {
    initValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    placeholder: PropTypes.string,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func,
};
export default Select;
