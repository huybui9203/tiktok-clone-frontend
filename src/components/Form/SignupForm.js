import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { changeEmail, changePassword, changedBirthday, changeCodeVerificationEmail } from './actions';
import signupReducer, { initialFormValue } from './signupReducer';
import Button from '~/components/Button';
import FormGroup from '~/components/FormGroup';
import validator from '~/utils/validateForm';
import Select from '~/components/Select';
import SelectGroup from '~/components/SelectGroup';
import * as authService from '~/services/authService';
import { useToast, useForm, useStore } from '~/hooks';
import ButtonSendCode from './ButtonSendCode';
import LoginForm from './LoginForm';
import { validMailDomains, MONTHS, ALLOWED_AGE, CODE_EXPIRES } from './constants';
import styles from './Form.module.scss';
import { backUpSignUpData } from '~/store/actions';

const cx = classNames.bind(styles);

function SignupForm() {
    const {
        store: { backupSignUpData },
        dispatch: dispatchStore,
    } = useStore();

    const [formValue, dispatch] = useReducer(signupReducer, initialFormValue, (initialFormValue) => {
        const { email, birthday } = backupSignUpData;
        return {
            ...initialFormValue,
            birthday,
            email,
        };
    });

    const [isShowSuggestionEmail, setShowSuggestionEmail] = useState(false);

    const remainCodeTime = useRef(null);

    const [sendCode, setSendCode] = useState(() => {
        const sendCodeTimeOut = JSON.parse(sessionStorage.getItem('code_time_out'));
        const isCodeExpired = sendCodeTimeOut < Date.now() ? false : true;
        remainCodeTime.current = isCodeExpired ? Math.floor((sendCodeTimeOut - Date.now()) / 1000) : CODE_EXPIRES;
        return {
            isSending: false,
            isCounting: isCodeExpired,
            isError: false,
        };
    });

    const toast = useToast();
    const { setForm } = useForm();

    const [autoCheckValidEmail, setAutoCheckValidEmail] = useState(true);
    const listEmailSuggestionRef = useRef(null);
    const emailInputRef = useRef(null);

    document.title = 'Sign up | TikTok';

    const handleChangeEmail = (email) => {
        setShowSuggestionEmail(email.includes('@') && !email.startsWith('@') && !validator.isEmail(email));
        dispatch(changeEmail(email));
        setSendCode((prev) => ({ ...prev, isError: false }));
    };

    const handleEmailFocus = (email) => {
        setAutoCheckValidEmail(false);
        setShowSuggestionEmail(email.includes('@') && !email.startsWith('@') && !validator.isEmail(email));
    };

    const handleChangePassword = (password) => {
        dispatch(changePassword(password));
    };

    const handleSelectEmailSelection = (email) => {
        dispatch(changeEmail(email));
        setShowSuggestionEmail(false);
    };

    const handleToggleFormLogin = (e) => {
        e.preventDefault();
        setForm(<LoginForm />);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = formValue;
        const [data, error] = await authService.register({
            year: formData.birthday.year,
            month: formData.birthday.month,
            day: formData.birthday.day,
            email: formData.email.value,
            password: formData.password.value,
            otp: formData.code.value,
        });

        if (data) {
            setForm(<LoginForm />);
        } else {
            if (!error?.status) {
                toast.show('Something went wrong');
            } else {
                toast.show('Verification failed');
            }
        }
    };

    const handleSendCode = useCallback(async () => {
        setSendCode((prev) => ({ ...prev, isSending: true }));
        const [data, error] = await authService.sendCodeVerification(formValue.email.value);
        setSendCode((prev) => ({ ...prev, isSending: false }));
        if (data) {
            console.log(data);
            setSendCode((prev) => ({ ...prev, isCounting: true }));
        } else if (error?.status === 409) {
            setSendCode((prev) => ({ ...prev, isError: true }));
        } else if (error?.status === 500) {
            toast.show('Send code failed');
        } else {
            toast.show('Something went wrong');
        }
    }, [formValue.email.value]);

    const handleTimeout = useCallback(() => {
        setSendCode((prev) => ({ ...prev, isSending: false, isCounting: false }));
        sessionStorage.clear('code_time_out');
    }, []);

    const renderListYears = useMemo(() => {
        const listYears = Array(100)
            .fill()
            .map((_, index) => new Date().getFullYear() - (index + 1));
        return listYears;
    }, []);

    const renderListMonths = useMemo(() => {
        return Object.keys(MONTHS);
    }, []);

    const renderListDayInMonth = useMemo(() => {
        const { year, month } = formValue.birthday;
        const maxDayInCurrentMonth = new Date(year, month, 0).getDate();
        const listDayInMonth = Array(maxDayInCurrentMonth)
            .fill()
            .map((_, index) => maxDayInCurrentMonth - index);
        return listDayInMonth.reverse();
    }, [formValue.birthday.year, formValue.birthday.month]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const listEmailSuggestion = listEmailSuggestionRef.current;
            const emailInput = emailInputRef.current;
            if (
                emailInput &&
                listEmailSuggestion &&
                !listEmailSuggestion.contains(e.target) &&
                !emailInput?.children[0]?.children[1]?.contains(e.target) //not inside input element
            ) {
                setShowSuggestionEmail(false);
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const { birthday, email } = formValue;
        dispatchStore(backUpSignUpData({ birthday, email }));
    }, [formValue]);

    return (
        <form className={cx('form')} onSubmit={handleSubmit}>
            <h2 className={cx('heading')}>Sign up</h2>

            <SelectGroup
                label="When's your birthday?"
                helperText="Your birthday won't be shown publicly."
                direction="horizontal"
                error={
                    !formValue.birthday.isValid &&
                    formValue.birthday.year > 0 &&
                    formValue.birthday.month > 0 &&
                    formValue.birthday.day > 0
                }
                errorMessage={
                    !validator.isValidDate(formValue.birthday)
                        ? 'Enter a valid date'
                        : new Date().getFullYear() - formValue.birthday.year < ALLOWED_AGE
                        ? 'Make sure you enter real your birthday'
                        : ''
                }
            >
                <Select
                    placeholder="Month"
                    initValue={Object.keys(MONTHS)[formValue.birthday?.month - 1]}
                    options={renderListMonths}
                    onSelect={(value) => dispatch(changedBirthday({ value: MONTHS[value], type: 'month' }))}
                />
                <Select
                    placeholder="Day"
                    initValue={formValue.birthday?.day}
                    options={renderListDayInMonth}
                    onSelect={(value) => dispatch(changedBirthday({ value, type: 'day' }))}
                />
                <Select
                    placeholder="Year"
                    initValue={formValue.birthday?.year}
                    options={renderListYears}
                    onSelect={(value) => dispatch(changedBirthday({ value, type: 'year' }))}
                />
            </SelectGroup>

            <div className={cx('email-wrapper')}>
                <div ref={emailInputRef}>
                    <FormGroup
                        autoCheckValid={autoCheckValidEmail}
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
                    <p style={{ fontSize: '12px', fontWeight: 600, marginTop: '-2px' }}>
                        You've already signed up,
                        <span className={cx('sign-up')} onClick={handleToggleFormLogin}>
                            Log in
                        </span>
                    </p>
                )}
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

            <div className={cx('code-input-container')}>
                <FormGroup
                    customInputClass={cx('code-input')}
                    required
                    name={'code'}
                    type={'text'}
                    placeholder={'Enter 6-digit code'}
                    error={!formValue.code.isValid}
                    errorMessage={'Email is invalid!'}
                    value={formValue.code.value}
                    onChange={(codeString) => dispatch(changeCodeVerificationEmail(codeString))}
                />
                <ButtonSendCode
                    disabled={!formValue.email.isValid || sendCode.isCounting || sendCode.isSending}
                    isSending={sendCode.isSending}
                    isCounting={sendCode.isCounting}
                    seconds={remainCodeTime.current}
                    onTimeOut={handleTimeout}
                    onSendCode={handleSendCode}
                />
            </div>

            <Button
                type="submit"
                className={cx('btn-submit')}
                disabled={!formValue.isValidated}
                primary={formValue.isValidated}
            >
                Next
            </Button>
            <p className={cx('policy-confirm')}>
                By continuing with an account located in Vietnam, you agree to our{' '}
                <a className={cx('terms')}>Terms of Service</a> and acknowledge that you have read our{' '}
                <a className={cx('policy')}>Privacy Policy</a>.
            </p>
        </form>
    );
}

export default SignupForm;
