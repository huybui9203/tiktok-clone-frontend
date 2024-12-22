import * as userService from '~/services/userService';

const profileKeys = {
    profile: (username) => ['users', username],
    username: (usernameChanged) => ['username', usernameChanged]
};

const queryFns = {
    getProfile: async (username, pageParam) => {
        const [data, error] = await userService.getProfileOfUser(username, { page: pageParam });
        if (error) {
            throw error?.response;
        }
        const { profile, pagination } = data;
        const nextPageParam =
            pagination.current_page < pagination.total_pages ? pagination.current_page + 1 : undefined;
        const prevPageParam = pagination.current_page > 1 ? pagination.current_page - 1 : undefined;
        return { profile, prevPageParam, nextPageParam }; //data.pages = [page, ...]
    },

    checkValidUsername: async () => {
        
    },
};

export { profileKeys, queryFns };
