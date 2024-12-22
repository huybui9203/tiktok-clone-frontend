const actions = {
    CHANGED_EMAIL: 'changed_email',
    CHANGED_PASSWORD: 'changed_password',
    SHOW_FORM: 'show_form',
    CHANGED_BIRTHDAY: 'changed_birthday',
    CHANGED_CODE: 'changed_code_verification_email',
};

const changeEmail = (payload) => ({
    type: actions.CHANGED_EMAIL,
    payload,
});

const changePassword = (payload) => ({
    type: actions.CHANGED_PASSWORD,
    payload,
});

const changedBirthday = (payload) => ({
    type: actions.CHANGED_BIRTHDAY,
    payload,
});

const changeCodeVerificationEmail = (payload) => ({
    type: actions.CHANGED_CODE,
    payload,
});

export { changeEmail, changePassword, changedBirthday, changeCodeVerificationEmail };
export default actions;
