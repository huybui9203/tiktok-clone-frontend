const actions = {
    GET_VIDEO_UUIDS: 'get_video_uuids',
}

const getVideoUuids = payload => ({
    type: actions.GET_VIDEO_UUIDS,
    payload
})

export { actions, getVideoUuids, }