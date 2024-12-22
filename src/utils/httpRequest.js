import axios from 'axios';
import * as authService from '~/services/authService';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

const authUrls = [
    'http://localhost:5000/v1/auth/me',
    'http://localhost:5000/v1/auth/logout',
    'http://localhost:5000/v1/users/',
    'http://localhost:5000/v1/videos',
    '/comments',
    '/videos',
];

let isRefreshing = false;
let listRetryRequests = [];
let requestIntercept, responseIntercept;

const retryRequests = (isOk, newAccessToken) => {
    listRetryRequests.map((retryRequest) => retryRequest(newAccessToken, isOk));
    listRetryRequests = [];
};

const AxiosInterceptor = (logout) => {
    requestIntercept = httpRequest.interceptors.request.use(
        (config) => {
            console.log(config.url);
            const accessToken = localStorage.getItem('token');
            if (
                accessToken &&
                !config.headers.Authorization &&
                (authUrls.includes(config.url) || authUrls.some(authUrl => config.url.includes(authUrl)))
            ) {
                config.headers.Authorization = 'Bearer ' + accessToken;
            }
            return config;
        },
        (error) => Promise.reject(error),
    );

    responseIntercept = httpRequest.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (
                error?.response?.status === 401 &&
                (authUrls.includes(error?.config?.url) || authUrls.some(authUrl => error?.config?.url.includes(authUrl))) &&
                !originalRequest._retry
            ) {
                originalRequest._retry = true;

                if (!isRefreshing) {
                    isRefreshing = true;
                    const newAccessToken = await authService.refeshToken();
                    isRefreshing = false;

                    if (newAccessToken) {
                        localStorage.setItem('token', newAccessToken);
                        return new Promise((resolve) => {
                            listRetryRequests.push((newAccessToken) => {
                                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                                resolve(httpRequest(originalRequest));
                            });

                            retryRequests(true, newAccessToken);
                        });
                    } else {
                        logout();
                        retryRequests(false);
                        return new Promise.reject(error);
                    }
                }

                //pause until first request done
                return new Promise((resolve, reject) => {
                    listRetryRequests.push((newAccessToken, isOk) => {
                        if (!isOk) {
                            return reject(error); //avoid pending
                        }
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        resolve(httpRequest(originalRequest));
                    });
                });
            }
            return Promise.reject(error);
        },
    );
};

const removeInterceptor = () => {
    if (requestIntercept && responseIntercept) {
        httpRequest.interceptors.request.eject(requestIntercept);
        httpRequest.interceptors.response.eject(responseIntercept);
    }
};

const get = async (path, options = {}) => {
    const res = await httpRequest.get(path, options);
    return res.data;
};

const post = async (path, data, options = {}) => {
    const res = await httpRequest.post(path, data, options);
    return res.data;
};

const Delete = async (path, options = {}) => {
    const res = await httpRequest.delete(path, options);
    return res.data;
};

const put = async (path, data, options = {}) => {
    const res = await httpRequest.put(path, data, options);
    return res.data;
};

const patch = async (path, data = {}, options = {}) => {
    const res = await httpRequest.patch(path, data, options);
    return res.data;
};

export { AxiosInterceptor, removeInterceptor, get, post, Delete, put, patch };
export default httpRequest;
