import { useReducer, useState } from 'react';
import classNames from 'classnames/bind';
import { changeEmail, changePassword } from './actions';
import loginReducer, { initialFormValue } from './loginReducer';
import Button from '~/components/Button';
import FormGroup from '~/components/FormGroup';
import styles from './Form.module.scss';
import { useLogin, useForm, useToast } from '~/hooks';
import Spinner from '~/components/Spinner';
import * as authService from '~/services/authService';
import ResetPasswordForm from './ResetPasswordForm';

const cx = classNames.bind(styles);

function LoginForm() {
    const [formValue, dispatch] = useReducer(loginReducer, initialFormValue);
    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const email = formValue.data.email;
    const password = formValue.data.password;
    document.title = 'Log in | TikTok';
    const { setForm, closeForm } = useForm();
    const login = useLogin();
    const toast = useToast();

    const handleChangeEmail = (emailValue) => {
        dispatch(changeEmail(emailValue));
        setError(false);
    };
    const handleChangePassword = (passwordValue) => {
        dispatch(changePassword(passwordValue));
        setError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //post login
        if (formValue.isValidated) {
            const formData = { email: email.value, password: password.value };
            setLoading(true);
            setError(false);
            const [userData, error] = await authService.login(formData);
            setLoading(false);
            if (userData) {
                toast.show('Log in successfully').then(() => {
                    login(userData);
                });
                closeForm();
                // window.location.reload();
            } else {
                if (error?.status === 401) {
                    setError(true);
                } else {
                    toast.show('Something went wrong');
                }
            }
        }
    };

    const handleToggleResetForm = () => {
        setForm(<ResetPasswordForm />);
    };

    return (
        <form className={cx('form')} onSubmit={handleSubmit}>
            <h2 className={cx('heading')}>Log in</h2>
            <FormGroup
                // required
                name={'email'}
                type={'text'}
                label={'Email'}
                error={!email.isValid}
                value={email.value}
                placeholder={'Enter your email'}
                errorMessage={'Email is invalid!'}
                onChange={handleChangeEmail}
            />
            <FormGroup
                // required
                name={'password'}
                type={'password'}
                label={'Password'}
                error={!password.isValid}
                value={password.value}
                placeholder={'Enter your password'}
                errorMessage={'Password is invalid!'}
                onChange={handleChangePassword}
            />
            {isError && (
                <span className={cx('error-message')}>Your email or password doesn't match our record. Try again!</span>
            )}
            <p className={cx('forgot-password', 'link')} onClick={handleToggleResetForm}>
                Forgot password?
            </p>
            <Button
                type="submit"
                className={cx('btn-submit')}
                disabled={!formValue.isValidated}
                primary={formValue.isValidated}
            >
                {isLoading ? <Spinner color={'#fff'} fontSize={'1.6rem'} /> : 'Log in'}
            </Button>
        </form>
    );
}

export default LoginForm;
