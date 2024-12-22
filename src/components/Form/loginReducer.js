import validator from '~/utils/validateForm';
import actions from './actions';

const initialFormValue = {
    isValidated: false,
    data: {
        email: { value: '', isValid: false },
        password: { value: '', isValid: false },
    },
};

const loginReducer = (formValue, action) => {
    const email = { ...formValue.data.email };
    const password = { ...formValue.data.password };
    let isValidatedForm = false
    switch (action.type) {
        case actions.CHANGED_EMAIL:
            const emailValue = action.payload;
            email.isValid = !validator.isEmpty(emailValue);
            email.value = emailValue;

            isValidatedForm = email.isValid && password.isValid;
            return { ...formValue, isValidated: isValidatedForm, data: { email, password } };

        case actions.CHANGED_PASSWORD:
            const passwordValue = action.payload;
            password.isValid = !validator.isEmpty(passwordValue);
            password.value = passwordValue;

            isValidatedForm = email.isValid && password.isValid;
            return { ...formValue, isValidated: isValidatedForm, data: { email, password } };

        default:
            throw new Error('Invalid action: ' + action.type);
    }
};

export { initialFormValue };
export default loginReducer;
