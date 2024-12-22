import * as httpRequest from '~/utils/httpRequest';

const getComments = async (videoId, page = 1, parentId) => {
    const params = parentId ? { replyTo: parentId, page } : { page };
    const {
        data: listComments,
        meta: { pagination },
    } = await httpRequest
        .get(`${process.env.REACT_APP_TEST_URL}/videos/${videoId}/comments`, {
            params
        })
        .then((res) => res)
        .catch((err) => console.log(err));

    return { listComments, pagination };
};

const postComment = async (videoId, { comment, authorVideoId, tags, parentId }) => {
    const data = await httpRequest
        .post(`${process.env.REACT_APP_TEST_URL}/videos/${videoId}/comments`, {
            comment,
            authorVideoId,
            tags,
            parentId,
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
    return data;
};

const updateComment = async (commentId, newComment) => {
    const data = await httpRequest
        .patch(`/comments/${commentId}`, { comment: newComment })
        .then((res) => res.data)
        .catch((err) => console.log(err));
    return data;
};

const deleteComment = async (commentId) => {
    const res = await httpRequest
        .Delete(`/comments/${commentId}`)
        .then(() => commentId)
        .catch((err) => console.log(err));
    return res;
};

export { getComments, postComment, updateComment, deleteComment };
