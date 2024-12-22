import * as likeService from '~/services/likeService'
import * as followService from '~/services/followService'

const ERROR_MESSAGE = 'something was wrong!';

const videoKeys = {
    all: ['videos'],
    detail: ['video'],
    video: (uuid) => [...videoKeys.detail, uuid],
    list: (userId) => [...videoKeys.all, userId],
};

const searchUserKeys = {
    listAll: (value) => ['search', 'user', { value, type: 'more' }],
    list: (value) => ['search', 'user', { value, type: 'less' }],
};

const mutationFns = {
    likeVideo: async ({ videoUuid }) => {
        const videoData = await likeService.likeVideo(videoUuid);
        if (!videoData) {
            return Promise.reject(new Error(ERROR_MESSAGE));
        }
        return { videoData };
    },

    unLikeVideo: async ({ videoUuid }) => {
        const videoData = await likeService.unLikeVideo(videoUuid);
        if (!videoData) {
            return Promise.reject(new Error(ERROR_MESSAGE));
        }
        return { videoData };
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

export { videoKeys, mutationFns };
