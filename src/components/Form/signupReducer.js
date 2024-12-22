import validator from '~/utils/validateForm';
import actions from './actions';
import { ALLOWED_AGE, LENGTH_CODE } from './constants';

const initialFormValue = {
    isValidated: false,
    email: { value: '', isValid: false },
    password: { value: '', isValid: false },
    birthday: { year: 0, month: 0, day: 0, isValid: false },
    code: { value: '', isValid: false },
};

const isValidatedForm = (email, password, birthday, code) => {
    return email.isValid && password.isValid && birthday.isValid && code.isValid;
};

const signupReducer = (formValue, action) => {
    const email = { ...formValue.email };
    const password = { ...formValue.password };
    const birthday = { ...formValue.birthday };
    const code = { ...formValue.code };
    let isValidated = false;
    switch (action.type) {
        case actions.CHANGED_EMAIL:
            const emailValue = action.payload;

            email.isValid = validator.isEmail(emailValue);
            email.value = emailValue;

            isValidated = isValidatedForm(email, password, birthday, code);
            return { ...formValue, isValidated, email };

        case actions.CHANGED_PASSWORD:
            const passwordValue = action.payload;
            if (
                !validator.isLimitLength(passwordValue, [8, 20], { trim: true }) ||
                !validator.isPassword(passwordValue)
            ) {
                password.isValid = false;
            } else {
                password.isValid = true;
            }

            password.value = passwordValue;

            isValidated = isValidatedForm(email, password, birthday, code);
            return { ...formValue, isValidated, password };
        case actions.CHANGED_BIRTHDAY:
            const { value, type } = action.payload;
            if (type === 'year') {
                birthday.year = value;
            } else if (type === 'month') {
                birthday.month = value;
            } else if (type === 'day') {
                birthday.day = value;
            }
            birthday.isValid = validator.isValidDate(birthday) && (new Date().getFullYear() - birthday.year) >= ALLOWED_AGE;
            isValidated = isValidatedForm(email, password, birthday, code);
            return { ...formValue, isValidated, birthday };
        case actions.CHANGED_CODE:
            const codeString = action.payload;
            code.value = codeString;
            code.isValid = codeString.length === LENGTH_CODE;
            isValidated = isValidatedForm(email, password, birthday, code);
            return { ...formValue, isValidated, code };
        default:
            throw new Error('Invalid action: ' + action.type);
    }
};

export { initialFormValue };
export default signupReducer;
