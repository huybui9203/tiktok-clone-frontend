import { videoKeys } from '~/utils/queryKeys';
import * as videoService from '~/services/videoService';

const ERROR_MESSAGE = 'something was wrong!';
const queryFns = {
    async getListVideos({ pageParam }) {
        const data = await videoService.getVideos({ type: 'for-you', page: pageParam });
        if (!data) {
            return new Promise.reject(new Error(ERROR_MESSAGE));
        }
        const {
            data: listVideos,
            meta: { pagination },
        } = data;
        const nextPageParam = pagination.links.next ? pagination.current_page + 1 : undefined;
        return { listVideos, nextPageParam };
    },
};

export { videoKeys, queryFns };
