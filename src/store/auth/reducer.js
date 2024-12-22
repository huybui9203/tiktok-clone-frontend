import { INITIALIZE, SIGN_IN, SIGN_OUT } from './constants';

const initState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const reducer = (state, action) => {
    const { isAuthenticated, user } = action.payload || state;
    switch (action.type) {
        case INITIALIZE:
            return {
                ...state,
                isInitialized: true,
                isAuthenticated,
                user,
            };

        case SIGN_IN:
            return {
                ...state,
                isAuthenticated: true,
                user,
            };

        case SIGN_OUT:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        default:
            throw new Error('action is invalid');
    }
};

export { initState };
export default reducer;
