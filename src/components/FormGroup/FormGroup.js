import { useEffect, useId, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './FormGroup.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { CheckIcon } from '../Icons';
const cx = classNames.bind(styles);

function FormGroup({
    autoCheckValid = false,
    required = false,
    autoFocus = false,
    disabled = false,
    readOnly = false,
    spellCheck = false,
    customInputClass = '',
    type = 'text', // text, password
    name = '',
    placeholder = '',
    label = '',
    errorMessage = '',
    helper = {},
    value = '',
    onChange = () => {},
    onFocus = () => {},
    error = false,
    hiddenIconSuccess = true,
}) {
    const id = useId();
    const [password, setPassword] = useState({ isShow: false, type: 'password' });
    const [isBlur, setBlur] = useState(false);
    const [isShowRules, setShowRules] = useState(false);

    const validRules = helper.rules || [];

    const handleShowPassword = () => {
        const isShow = !password.isShow;
        const type = isShow ? 'text' : 'password';
        setPassword({ isShow, type });
    };

    const handleChange = (e) => {
        if (disabled || readOnly) {
            e.preventDefault();
            return;
        }
        if (typeof onChange === 'function') {
            onChange(e.target.value);
        }
    };

    const handleFocus = (e) => {
        setShowRules(true);
        setBlur(false);
        onFocus(e.target.value);
    };

    const handleBlur = () => {
        if (!value) {
            setShowRules(false);
        }
        setBlur(true);
    };

    const isError = value && error && (isBlur || autoCheckValid);
    // const isSuccess = (!required && value) || (value && !error);
    const isSuccess = value && !error && !hiddenIconSuccess;

    return (
        <div className={cx('wrapper')}>
            {label && (
                <label className={cx('label')} htmlFor={name + id}>
                    {label}
                </label>
            )}
            <div className={cx('control-wrapper', customInputClass)}>
                <input
                    id={name + id}
                    // autoComplete='off'
                    autoFocus={autoFocus}
                    spellCheck={spellCheck}
                    name={name}
                    type={type === 'password' ? password.type : type}
                    placeholder={placeholder}
                    className={cx('control', {
                        error: isError,
                    })}
                    readOnly={readOnly}
                    disabled={disabled}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                <div className={cx('control-icon')}>
                    {isError && <FontAwesomeIcon className={cx('error-icon')} icon={faTriangleExclamation} />}
                    {isSuccess && <FontAwesomeIcon className={cx('success-icon')} icon={faCheck} />}
                    {type === 'password' && (
                        <span className={cx('password-icon')} onClick={handleShowPassword}>
                            {password.isShow ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>
                    )}
                </div>
            </div>
            {isError && errorMessage && <span className={cx('error-message')}>{errorMessage}</span>}

            {validRules.length > 0 && isShowRules && (
                <>
                    {required && value && helper.helperMessage && (
                        <span className={cx('error-message')}>{helper.helperMessage}</span>
                    )}
                    <p className={cx('helper-title')}>{helper.title}</p>
                    {validRules.map((rule, index) => (
                        <p
                            key={index}
                            className={cx('helper-text', {
                                success: required && value && rule.ok,
                                error: required && value && !rule.ok && isBlur,
                            })}
                        >
                            <FontAwesomeIcon className={cx('helper-icon')} icon={faCheck} />
                            <span>{rule.content}</span>
                        </p>
                    ))}
                </>
            )}
        </div>
    );
}

FormGroup.propTypes = {
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    hiddenIconSuccess: PropTypes.bool,
    error: PropTypes.bool,
    customInputClass: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    errorMessage: PropTypes.string,
    placeholder: PropTypes.string,
    helper: PropTypes.object,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
};

export default FormGroup;
