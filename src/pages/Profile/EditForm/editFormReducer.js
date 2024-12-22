import { editFormActions } from './actions';
import validator from '~/utils/validateForm';

const initState = {
    isValidated: false,
    avatar: { value: null },
    username: { value: '', isValid: false, isLastChecked: false },
    nickname: { value: '', isValid: true },
    bio: { value: '', isValid: true },
};

const isValidatedForm = (avatar, username, nickname, bio) => {
    if (
        username.value.trim() === initData.username.trim() &&
        nickname.value.trim() === initData.nickname.trim() &&
        bio.value.trim() === initData.bio.trim()
    ) {
        return avatar.value === null ? false : true;
    }
    return username.isValid && nickname.isValid && bio.isValid;
};

let initData = {};

const editFormReducer = (state, action) => {
    const avatar = { ...state.avatar };
    const username = { ...state.username };
    const nickname = { ...state.nickname };
    const bio = { ...state.bio };
    let isValidated;
    switch (action.type) {
        case editFormActions.INIT_FORM_DATA:
            const payload = action.payload;
            username.value = payload.username;
            username.isValid = true;
            nickname.value = payload.nickname;
            bio.value = payload.bio;

            initData = { ...payload }; //store initial data

            return { ...state, username, nickname, bio };
        case editFormActions.CHOOSE_FILE:
            avatar.value = action.payload;
            isValidated = isValidatedForm(avatar, username, nickname, bio);
            return { ...state, avatar, isValidated };

        case editFormActions.CHANGE_USERNAME:
            username.value = action.payload;
            username.isValid = validator.isLimitLength(action.payload, [2, 24], { trim: true });
            username.isLastChecked = false;
            isValidated = isValidatedForm(avatar, username, nickname, bio);
            return { ...state, username, isValidated };

        case editFormActions.CHECK_VALID_USERNAME:
            const isValidUsernameChanged = action.payload;
            username.isValid =
                isValidUsernameChanged && validator.isLimitLength(username.value, [2, 24], { trim: true });
            username.isLastChecked = true;
            isValidated = isValidatedForm(avatar, username, nickname, bio);
            return { ...state, username, isValidated };

        case editFormActions.CHANGE_NICKNAME:
            nickname.value = action.payload;
            nickname.isValid = !validator.isEmpty(nickname.value);
            isValidated = isValidatedForm(avatar, username, nickname, bio);
            return { ...state, nickname, isValidated };

        case editFormActions.CHANGE_USER_BIO:
            bio.value = action.payload;
            isValidated = isValidatedForm(avatar, username, nickname, bio);
            return { ...state, bio, isValidated };

        default:
            throw new Error(`${action.type} is invalid action!`);
    }
};

export { initState };
export default editFormReducer;
