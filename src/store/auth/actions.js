import { INITIALIZE, SIGN_IN, SIGN_OUT } from './constants';

const initialize = (payload) => ({
    type: INITIALIZE,
    payload,
});

const signIn = (payload) => ({
    type: SIGN_IN,
    payload,
});

const signOut = () => ({
    type: SIGN_OUT,
});

export { initialize, signIn, signOut };
