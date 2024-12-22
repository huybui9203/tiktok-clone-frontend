import * as httpRequest from '~/utils/httpRequest'; //gom tat ca export const vao obj request

const getSuggested = async ({ page = 1, perPage = 5 }) => {
    try {
        const data = await httpRequest.get('/users/suggested', {
            params: {
                page,
                per_page: perPage,
            },
        });
        return data;
    } catch (error) {
        console.log();
    }
};

const getProfileOfUser = async (username, { page }) => {
    const [data, error] = await httpRequest
        .get(`${process.env.REACT_APP_TEST_URL}/users/${username}`, {
            params: {
                page,
            },
        })
        .then((response) => [{ profile: response.data, pagination: response?.meta?.pagination }])
        .catch((error) => [undefined, error]);
    return [data, error];
};

const updateProfile = async (userId, data) => {
    const res = await httpRequest
        .patch(`${process.env.REACT_APP_TEST_URL}/users/${userId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => console.log(err));
    return res;
};

const checkValidUsername = async (username) => {
    const response = await httpRequest
        .get(`${process.env.REACT_APP_TEST_URL}/users/${username}/check-valid`)
        .catch((error) => console.log(error));
    return response;
};

export { getSuggested, getProfileOfUser, updateProfile, checkValidUsername };
