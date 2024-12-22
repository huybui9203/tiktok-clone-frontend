const editFormActions = {
    CHANGE_USERNAME: 'change_username',
    CHANGE_NICKNAME: 'change_nickname',
    CHANGE_USER_BIO: 'change_user_bio',
    CHOOSE_FILE: 'choose_file',
    INIT_FORM_DATA: 'init_form_data',
    CHECK_VALID_USERNAME: 'check_valid_username',
};

const changeUsername = (payload) => ({
    type: editFormActions.CHANGE_USERNAME,
    payload,
});

const changeNickname = (payload) => ({
    type: editFormActions.CHANGE_NICKNAME,
    payload,
});

const changeUserBio = (payload) => ({
    type: editFormActions.CHANGE_USER_BIO,
    payload,
});

const chooseFile = (payload) => ({
    type: editFormActions.CHOOSE_FILE,
    payload,
});

const initFormData = (payload) => ({
    type: editFormActions.INIT_FORM_DATA,
    payload,
});

const checkValidUsername = (payload) => ({
    type: editFormActions.CHECK_VALID_USERNAME,
    payload,
});

export { chooseFile, changeUsername, changeNickname, changeUserBio, initFormData, checkValidUsername, editFormActions };
