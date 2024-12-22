import * as userService from '~/services/userService';
import * as followService from '~/services/followService';
const ERROR_MESSAGE = 'something was wrong!';

const followKeys = {
    all: ['follows'],
    lists: () => [...followKeys.all, 'list'],
};

const userKeys = {
    all: ['users'],
    lists: () => [...userKeys.all, 'list'],
    list: (filter) => [...userKeys.lists(), { filter }],
};

const queryFns = {
    async listSuggestions({ pageParam }) {
        const perPage = pageParam > 1 ? 20 : 5; 
        const data = await userService.getSuggested({ page: pageParam, perPage });
        if (!data) {
            return new Promise.reject(new Error(ERROR_MESSAGE));
        }

        const {
            data: listSuggestions,
            meta: { pagination },
        } = data;

        const nextPageParam = pageParam < 2 ? (pagination.links.next ? pagination.current_page + 1 : undefined) : undefined;
        return { listSuggestions, nextPageParam };
    },

    async listFollowings({ pageParam }) {
        const data = await followService.getFollowings({ page: pageParam });
        if (!data) {
            return new Promise.reject(new Error(ERROR_MESSAGE));
        }

        const {
            data: listFollowings,
            meta: { pagination },
        } = data;

        const nextPageParam = pagination.links.next ? pagination.current_page + 1 : undefined;
        return { listFollowings, nextPageParam };
    },

    followUser: async ({ userId }) => {
        const userData = await followService.follow(userId);
        if (!userData) {
            return Promise.reject(new Error(ERROR_MESSAGE));
        }
        return { userData };
    },

    unfollowUser: async ({ userId }) => {
        const userData = await followService.unfollow(userId);
        if (!userData) {
            return Promise.reject(new Error(ERROR_MESSAGE));
        }
        return { userData };
    },
};

export { followKeys, userKeys, queryFns };

// const videoKeys = {
//     all: ['videos'],
//     lists: () => [...videoKeys.all, 'list'],
//     list: (filters) => [...videoKeys.lists(), { filters }],
//     details: () => [...videoKeys.all, 'detail'],
//     detail: (id) => [...videoKeys.details(), id],
// };

//has follow: video, videos list, comments list, suggestions, following
/**
 * video: ['videos', 'detail', uuuid]
 * videos list: ['videos', 'list]
 * comments list: ['videos', detail, uuid, 'comments']
 * suggestions: ['users', 'list', {filter: 'suggestion'}]
 * followings: ['users', 'list', {filter: 'following'}]
 */
//like/comment video: video, videos list


