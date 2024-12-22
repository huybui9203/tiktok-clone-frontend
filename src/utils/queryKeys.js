const videoKeys = {
    all: ['videos'],
    lists: () => [...videoKeys.all, 'list'],
    list: (filters) => [...videoKeys.lists(), { filters }],
    details: () => [...videoKeys.all, 'detail'],
    detail: (uuid) => [...videoKeys.details(), uuid],
};

const commentKeys = {
    list: (videoUuid) => [...videoKeys.detail(videoUuid), 'comments'],
};

const userKeys = {
    all: ['users'],
    lists: () => [...userKeys.all, 'list'],
    list: (filters) => [...userKeys.lists(), { filters }],
    listType: (filters, type) => [...userKeys.list(filters), { type }],
};

//[users, list, {filter: abc},]

//has follow: video, videos list, comments list, suggestions, following
/**
 * video: ['videos', 'detail', uuuid]
 * videos list: ['videos', 'list]
 * comments list: ['videos', detail, uuid, 'comments']
 * suggestions: ['users', 'list', {filter: 'suggestion'}]
 * followings: ['users', 'list', {filter: 'following'}]
 */

export { videoKeys, commentKeys, userKeys };
