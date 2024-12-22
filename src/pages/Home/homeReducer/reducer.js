import { actions } from './actions';
export const initialState = {
    videoUuids: [{
        nickname: '',
        uuid: '',
    }],
};

const reducer = (state, action) => {
    switch (action.type) {
        case actions.GET_VIDEO_UUIDS:
            return {
                ...state,
                videoUuids: action.payload,
            };

        default:
            return state;
    }
};

export default reducer;
