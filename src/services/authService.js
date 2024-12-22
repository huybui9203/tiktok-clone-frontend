import * as httpRequest from '~/utils/httpRequest';

const sendCodeVerification = async (email, options = { type: 'signup' }) => {
    const [data, error] = await httpRequest
        .post(
            `${process.env.REACT_APP_TEST_URL}/auth/send-code`,
            { email },
            {
                params: {
                    type: options.type,
                },
            },
        )
        .then((res) => [res.data, undefined])
        .catch((error) => [undefined, error?.response]);
    return [data, error];
};

const register = async ({ year, month, day, email, password, otp, id }) => {
    const formData = { year, month, day, email, password, otp, id };
    const [data, error] = await httpRequest
        .post(`${process.env.REACT_APP_TEST_URL}/auth/register`, formData)
        .then((res) => [res.data, undefined])
        .catch((error) => [undefined, error?.response]);
    return [data, error];
};

const login = async ({ email, password }) => {
    const data = await httpRequest
        .post(
            `${process.env.REACT_APP_TEST_URL}/auth/login`,
            { email, password },
            {
                withCredentials: true,
            },
        )
        .then((data) => [data, undefined])
        .catch((error) => [undefined, error?.response]);
    return data;
};

const resetPassword = async ({ email, otp, id, password }) => {
    const [data, error] = await httpRequest
        .post(
            `${process.env.REACT_APP_TEST_URL}/auth/reset-password`,
            { email, otp, id, password },
            {
                withCredentials: true,
            },
        )
        .then((res) => [res, undefined])
        .catch((error) => [undefined, error?.response]);
    return [data, error];
};

const refeshToken = async () => {
    const accessToken = await httpRequest
        .post(
            `${process.env.REACT_APP_TEST_URL}/auth/refresh-token`,
            {},
            {
                withCredentials: true,
            },
        )
        .then((res) => res.token)
        .catch((err) => console.log(err));
    return accessToken;
};

const logout = async () => {
    const data = await httpRequest
        .post(`${process.env.REACT_APP_TEST_URL}/auth/logout`, null, {
            withCredentials: true,
        })
        .catch((err) => console.log(err));
    return data;
};

const getCurrentUser = async () => {
    const data = await httpRequest.get(`${process.env.REACT_APP_TEST_URL}/auth/me`).catch((err) => console.log(err));
    return data;
};

const updateProfile = async (formData) => {
    const data = await httpRequest
        .post('/auth/me?_method=PATCH', formData)
        .then((res) => res.data)
        .catch((err) => console.log(err));
    return data;
};

const loginWithGoogle = async (googleId, tokenAuth, socialType) => {
    const data = await httpRequest
        .post(
            `${process.env.REACT_APP_TEST_URL}/auth/google/login`,
            { socialId: googleId, tokenAuth, socialType },
            {
                withCredentials: true,
            },
        )
        .catch((err) => console.log(err));
    return data;
};

const loginWithFacebook = async (facebookId, tokenAuth, socialType) => {
    const data = await httpRequest
        .post(
            `${process.env.REACT_APP_TEST_URL}/auth/facebook/login`,
            { socialId: facebookId, tokenAuth, socialType },
            {
                withCredentials: true,
            },
        )
        .catch((err) => console.log(err));
    return data;
};
export {
    sendCodeVerification,
    register,
    login,
    logout,
    getCurrentUser,
    updateProfile,
    resetPassword,
    refeshToken,
    loginWithGoogle,
    loginWithFacebook,
};
