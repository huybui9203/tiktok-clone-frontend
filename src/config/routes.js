const routes = {
    home: '/',
    following: '/following',
    profile: '/:username',
    search: '/search',
    upload: '/upload',
    friends: '/friend',
    explore: '/explore',
    live: '/live',
    userVideo: '/:username/video/:uuid',
    oauth: '/oauth',
    page404: '*',
};

const linkToRoute = {
    profile: (username) => {
        return `/@${username}`;
    },

    video: (username, uuid) => {
        return `/@${username}/video/${uuid}`;
    },
};
export { linkToRoute };
export default routes;
