import actionTypes, { backUpSignUpData } from './actions';

export const initState = {
    form: {
        isShow: false,
    },
    search: {
        isLoading: false,
    },
    backupSignUpData: {
        email: { value: '', isValid: false },
        birthday: { year: 0, month: 0, day: 0, isValid: false },
    },
};

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SHOW_FORM:
            return {
                ...state,
                form: {
                    isShow: true,
                },
            };
        case actionTypes.HIDE_FORM:
            return {
                ...state,
                form: {
                    isShow: false,
                },
            };
        case actionTypes.SET_SEARCH_IS_LOADING:
            return {
                ...state,
                search: {
                    isLoading: action.payload,
                },
            };
        case actionTypes.BACKUP_SIGN_UP_DATA:
            return {
                ...state,
                backupSignUpData: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
