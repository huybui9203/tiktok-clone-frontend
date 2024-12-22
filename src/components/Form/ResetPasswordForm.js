import { useReducer, useState, useCallback, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import { changeCodeVerificationEmail, changeEmail, changePassword } from './actions';

import Button from '~/components/Button';
import FormGroup from '~/components/FormGroup';
import styles from './Form.module.scss';
import { useLogin, useToast, useForm } from '~/hooks';
import * as authService from '~/services/authService';
import ButtonSendCode from './ButtonSendCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import LoginForm from './LoginForm';
import resetPasswordReducer, { initialFormValue } from './resetPasswordReducer';
import { validMailDomains } from './constants';
import validator from '~/utils/validateForm';

const cx = classNames.bind(styles);

function ResetPasswordForm() {
    const [formValue, dispatch] = useReducer(resetPasswordReducer, initialFormValue);
    const [isShowSuggestionEmail, setShowSuggestionEmail] = useState(false);
    const [sendCode, setSendCode] = useState({
        isSending: false,
        isCounting: false,
        isError: false,
    });
    const listEmailSuggestionRef = useRef(null);
    const emailInputRef = useRef(null);
    const { setForm, closeForm } = useForm();
    const toast = useToast();
    const login = useLogin();

    const handleBack = () => {
        setForm(<LoginForm />);
    };

    const handleChangeEmail = (email) => {
        setShowSuggestionEmail(email.includes('@') && !email.startsWith('@') && !validator.isEmail(email));

        dispatch(changeEmail(email));
        setSendCode((prev) => ({ ...prev, isError: false }));
    };

    const handleEmailFocus = (email) => {
        setShowSuggestionEmail(email.includes('@') && !email.startsWith('@') && !validator.isEmail(email));
    };

    const handleSelectEmailSelection = (email) => {
        dispatch(changeEmail(email));
        setShowSuggestionEmail(false);
    };

    const handleChangeCode = (code) => {
        dispatch(changeCodeVerificationEmail(code));
    };

    const handleChangePassword = (password) => {
        dispatch(changePassword(password));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = formValue;
        const [data, error] = await authService.resetPassword({
            email: formData.email.value,
            password: formData.password.value,
            otp: formData.code.value,
        });
       
        if (data) {
            login(data);
            closeForm();
        } else {
            toast.show('Verification failed');
        }
    };

    const handleSendCode = useCallback(async () => {
        setSendCode((prev) => ({ ...prev, isSending: true }));
        const [data, error] = await authService.sendCodeVerification(formValue.email.value, { type: 'reset-password' });
        setSendCode((prev) => ({ ...prev, isSending: false }));
        if (data) {
            setSendCode((prev) => ({ ...prev, isCounting: true }));
        }

        //handling error
        else if (error?.status === 404) {
            setSendCode((prev) => ({ ...prev, isError: true }));
        } else if (error?.status === 500) {
            toast.show('Send code failed');
        } else {
            toast.show('Something went wrong');
        }
    }, [formValue.email.value]);

    const handleTimeout = useCallback(() => {
        setSendCode((prev) => ({ ...prev, isSending: false, isCounting: false }));
    }, []);

    useEffect(() => {
        const handleClickOutsite = (e) => {
            const listEmailSuggestion = listEmailSuggestionRef.current;
            const emailInput = emailInputRef.current;
            if (
                emailInput &&
                listEmailSuggestion &&
                !listEmailSuggestion.contains(e.target) &&
                !emailInput.contains(e.target)
            ) {
                setShowSuggestionEmail(false);
            }
        };
        document.addEventListener('click', handleClickOutsite);

        return () => document.removeEventListener('click', handleClickOutsite);
    }, []);

    return (
        <form className={cx('form', 'reset-form')} onSubmit={handleSubmit}>
            <button className={cx('btn-back')} onClick={handleBack}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <h2 className={cx('heading')}>Reset password</h2>
            <div className={cx('email-wrapper')}>
                <div ref={emailInputRef}>
                    <FormGroup
                        required
                        name={'email'}
                        type={'text'}
                        placeholder={'Enter your email'}
                        label={'Email'}
                        error={(!isShowSuggestionEmail && !formValue.email.isValid) || !!sendCode.isError}
                        errorMessage={sendCode.isError ? '' : 'Email is invalid!'}
                        value={formValue.email.value}
                        onChange={handleChangeEmail}
                        onFocus={handleEmailFocus}
                    />
                </div>
                {isShowSuggestionEmail && (
                    <ul ref={listEmailSuggestionRef} className={cx('email-suggestion')}>
                        {validMailDomains.map((mailDomain, index) => {
                            const email =
                                formValue.email.value.slice(0, formValue.email.value.indexOf('@') + 1) + mailDomain;
                            return (
                                <li
                                    key={index}
                                    className={cx('email-suggest-item')}
                                    onClick={() => handleSelectEmailSelection(email)}
                                >
                                    {email}
                                </li>
                            );
                        })}
                    </ul>
                )}
                {sendCode.isError && (
                    <p style={{ fontSize: '12px', fontWeight: 600, marginTop: '-2px' }}>Email don't exist,</p>
                )}
            </div>

            <div className={cx('code-input-container')}>
                <FormGroup
                    customInputClass={cx('code-input')}
                    required
                    name={'code'}
                    type={'text'}
                    placeholder={'Enter 6-digit code'}
                    error={!formValue.code.isValid}
                    errorMessage={'Enter 6-digit code!'}
                    value={formValue.code.value}
                    onChange={handleChangeCode}
                />
                <ButtonSendCode
                    disabled={!formValue.email.isValid || sendCode.isCounting || sendCode.isSending}
                    isSending={sendCode.isSending}
                    isCounting={sendCode.isCounting}
                    seconds={60}
                    onTimeOut={handleTimeout}
                    onSendCode={handleSendCode}
                />
            </div>
            <FormGroup
                required
                name={'password'}
                type={'password'}
                placeholder={'Enter your password'}
                label={'Password'}
                helper={{
                    title: 'Your password must have:',
                    rules: [
                        {
                            content: '8 to 20 characters',
                            ok: validator.isLimitLength(formValue.password.value, [8, 20], { trim: true }),
                        },
                        {
                            content:
                                'Letters, numbers and special characters(uppercase, lowercase, @, $, !, %, *, ?, & and #)',
                            ok: validator.isPassword(formValue.password.value),
                        },
                    ],
                    helperMessage: validator.match(formValue.password.value, /^[a-zA-Z0-9!@$!%*?&#]+$/)
                        ? ''
                        : 'Invalid special character!',
                }}
                error={!formValue.password.isValid}
                value={formValue.password.value}
                onChange={handleChangePassword}
            />
            <Button
                type="submit"
                className={cx('btn-submit')}
                disabled={!formValue.isValidated}
                primary={formValue.isValidated}
            >
                {/* {isLoading ? <Spinner color={'#fff'} fontSize={'1.6rem'}/> : 'Log in'} */}
                Log in
            </Button>
        </form>
    );
}

export default ResetPasswordForm;
