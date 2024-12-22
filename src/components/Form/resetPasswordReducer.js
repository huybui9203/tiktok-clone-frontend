import validator from '~/utils/validateForm';
import actions from './actions';
import { LENGTH_CODE } from './constants';

const initialFormValue = {
    isValidated: false,
    email: { value: '', isValid: false },
    code: { value: '', isValid: false },
    password: { value: '', isValid: false },
};

const isValidatedForm = (email, code, password) => {
    return email.isValid && password.isValid && code.isValid;
};

const resetPasswordReducer = (formValue, action) => {
    const email = { ...formValue.email };
    const code = { ...formValue.code };
    const password = { ...formValue.password };
    switch (action.type) {
        case actions.CHANGED_EMAIL:
            const emailValue = action.payload;
            email.value = emailValue;
            email.isValid = validator.isEmail(emailValue);

            return { ...formValue, isValidated: isValidatedForm(email, code, password), email };

        case actions.CHANGED_CODE:
            const codeValue = action.payload;
            code.value = codeValue;
            code.isValid = codeValue.length === LENGTH_CODE;

            return { ...formValue, isValidated: isValidatedForm(email, code, password), code };

        case actions.CHANGED_PASSWORD:
            const passwordValue = action.payload;
            password.value = passwordValue;
            password.isValid =
                validator.isPassword(passwordValue) && validator.isLimitLength(passwordValue, [8, 20], { trim: true });

            return { ...formValue, isValidated: isValidatedForm(email, code, password), password };

        default:
            throw new Error('Invalid action: ' + action.type);
    }
};

export { initialFormValue };
export default resetPasswordReducer;
