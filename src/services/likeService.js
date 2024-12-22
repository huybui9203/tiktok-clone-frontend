import * as httpRequest from '~/utils/httpRequest';

const likeComment = async (id) => {
    const data = await httpRequest
        .post(`/comments/${id}/like`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
    return data;
};

const unLikeComment = async (id) => {
    const data = await httpRequest
        .post(`/comments/${id}/unlike`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
    return data;
};

const likeVideo = async (videoUuid) => {
    const data = await httpRequest
        .post(`/videos/${videoUuid}/like`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
    return data;
};

const unLikeVideo = async (videoUuid) => {
    const data = await httpRequest
        .post(`/videos/${videoUuid}/unlike`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
    return data;
};




export { likeComment, unLikeComment, likeVideo, unLikeVideo };
