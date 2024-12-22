import * as httpRequest from '~/utils/httpRequest';

// const getVideos = async ({ type = 'for-you', page = 1 }) => {
//     const data = await httpRequest
//         .get('/videos', { params: { type, page } })
//         .then((res) => res.data)
//         .catch((err) => console.log(err));
//     console.log(data);
//     return data;
// };

const getVideos = async ({ type = 'for-you', page = 1 }) => {
    const data = await httpRequest
        .get(`${process.env.REACT_APP_TEST_URL}/videos`, { params: { type, page } })
        .then((res) => res.data)
        .catch((err) => console.log(err));
    return data;
};


const getVideo = async (uuid) => {
    const data = await httpRequest
        .get(`${process.env.REACT_APP_TEST_URL}/videos/${uuid}`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
    return data;
};

const uploadVideo = async (data, callback, { signal, chunk, uploadId }) => {
    const res = await httpRequest
        .post(`${process.env.REACT_APP_TEST_URL}/videos/upload`, data, {
            params: {
                uploadId,
                chunk,
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent;
                callback({ loaded, total });
            },
            signal,
            maxRedirects: 0, // avoid buffering the entire stream
        })
        .catch((err) => console.log(err));
    return res;
};

const postVideo = async(data) => {
    const res = await httpRequest
        .post(`${process.env.REACT_APP_TEST_URL}/videos`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .catch((err) => console.log(err));
    return res;
}

const removeExistVideo = async ({ chunk, uploadId }) => {
    const res = await httpRequest
        .post(`${process.env.REACT_APP_TEST_URL}/videos/remove-exist`, { chunk, uploadId })
        .catch((err) => console.log(err));
    return res
};

export { getVideos, getVideo, uploadVideo, removeExistVideo, postVideo };
