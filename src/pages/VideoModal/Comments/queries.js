import * as commentService from '~/services/commentService';
import * as likeService from '~/services/likeService';
import * as followService from '~/services/followService';

const ERROR_MESSAGE = 'something was wrong!';

const commentKeys = {
    list: (videoId) => ['videos', 'detail', videoId, 'comments'],
    reply: (videoId, parentId) => [...commentKeys.list(videoId), { replyTo: parentId }],
};

const mutationFns = {
    postComment: async ({ comment, tags, parentId, authorVideoId, videoId }) => {
        const commentData = await commentService.postComment(videoId, { comment, tags, parentId, authorVideoId });
        if (!commentData) {
            return Promise.reject(new Error(ERROR_MESSAGE));
        }

        return { commentData, message: 'Posted comment' };
    },

    updateComment: async ({ newComment, id }) => {
        const commentData = await commentService.updateComment(id, newComment);
        if (!commentData) {
            return Promise.reject(new Error(ERROR_MESSAGE));
        }
        return { commentData, message: 'Updated comment' };
    },

    deleteComment: async ({ id }) => {
        const res = await commentService.deleteComment(id);
        if (!res) {
            return Promise.reject(new Error(ERROR_MESSAGE));
        }
        return { id, message: 'Delete comment' };
    },

    likeComment: async ({ id }) => {
        const commentData = await likeService.likeComment(id);
        if (!commentData) {
            return Promise.reject(new Error(ERROR_MESSAGE));
        }
        return { commentData };
    },

    unLikeComment: async ({ id }) => {
        const commentData = await likeService.unLikeComment(id);
        if (!commentData) {
            return Promise.reject(new Error(ERROR_MESSAGE));
        }
        return { commentData };
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

const queryFns = {
    getListComments: async (videoId, pageParam, parentId) => {
        const { listComments, pagination } = await commentService.getComments(videoId, pageParam, parentId);
        const nextPageParam =
            pagination.current_page < pagination.total_pages ? pagination.current_page + 1 : undefined;
        const prevPageParam = pagination.current_page > 1 ? pagination.current_page - 1 : undefined;
        const totalComments = pagination.total;

        return { listComments, prevPageParam, nextPageParam, totalComments }; //data.pages = [page, ...]
    },
};
export { commentKeys, mutationFns, queryFns };
