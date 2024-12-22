import { createContext, useMemo, useState } from 'react';
import LoginForm from './LoginForm';
import classNames from 'classnames/bind';
import SignupForm from './SignupForm';
import { formTypes, listOptionsLogin, listOptionsSignup, EMAIL, GOOGLE, FACEBOOK } from './constants';
import styles from './Form.module.scss';

const cx = classNames.bind(styles);

const FormContext = createContext();
const appURL = process.env.REACT_APP_TEST_URL;

function Form({ onClose }) {
    const [formType, setFormType] = useState(formTypes.LOGIN);
    const [form, setForm] = useState(null);

    const lastLogin = localStorage.getItem('last_login');
    document.title = formType === formTypes.LOGIN ? 'Log in | TikTok' : 'Sign up | TikTok';

    const handleToggleForm = () => {
        setForm(null);
        setFormType((prev) => (prev === formTypes.LOGIN ? formTypes.SIGNUP : formTypes.LOGIN));
    };

    const handleSelect = (option) => {
        switch (formType) {
            case formTypes.LOGIN:
                if (option.type === EMAIL) {
                    setForm(<LoginForm />);
                } else if (option.type === GOOGLE) {
                    window.location.href = `${appURL}/auth/google`;
                } else if (option.type === FACEBOOK) {
                    window.location.href = `${appURL}/auth/facebook`;
                }
                break;
            case formTypes.SIGNUP:
                if (option.type === EMAIL) {
                    setForm(<SignupForm />);
                } else if (option.type === GOOGLE) {
                    window.location.href = `${appURL}/auth/google`;
                } else if (option.type === FACEBOOK) {
                    window.location.href = `${appURL}/auth/facebook`;
                }
                break;
            default:
                break;
        }
    };

    const formContextValue = useMemo(() => ({ setForm, closeForm: onClose }), []);

    return (
        <FormContext.Provider value={formContextValue}>
            {form ? (
                form
            ) : (
                <div className={cx('wrapper')}>
                    <h1 className={cx('title')}>
                        {formType === formTypes.LOGIN ? 'Log in for TikTok' : 'Sign up for TikTok'}
                    </h1>
                    {formType === formTypes.LOGIN ? (
                        <ul className={cx('list-options')}>
                            {listOptionsLogin.map((option, index) => {
                                return (
                                    <li key={index} className={cx('option')} onClick={() => handleSelect(option)}>
                                        <span className={cx('option-icon')}>{option.icon}</span>
                                        {option.text}
                                        {option.type === lastLogin && (
                                            <span className={cx('label-login')}>Last login</span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <ul className={cx('list-options')}>
                            {listOptionsSignup.map((option, index) => {
                                return (
                                    <li key={index} className={cx('option')} onClick={() => handleSelect(option)}>
                                        <span className={cx('option-icon')}>{option.icon}</span>
                                        {option.text}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
            <div className={cx('footer')}>
                <span>{formType === formTypes.LOGIN ? "Don't have an account?" : 'Already have an account?'}</span>
                <span className={cx('sign-up', 'link')} onClick={handleToggleForm}>
                    {formType === formTypes.LOGIN ? 'Sign up' : 'Log in'}
                </span>
            </div>
        </FormContext.Provider>
    );
}

export { FormContext };

export default Form;
