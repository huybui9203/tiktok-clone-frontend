import * as searchService from '~/services/searchService';
import { userKeys } from '~/utils/queryKeys';

const ERROR_MESSAGE = 'something was wrong!';

const queryFns = {
    async getListUsers(searchString, page) {
        const data = await searchService.search(searchString, { type: 'more', page });
        if (!data) {
            return new Promise.reject(new Error(ERROR_MESSAGE));
        }

        const { searchResult, pagination } = data;
        const nextPageParam = pagination.links.next ? pagination.current_page + 1 : undefined;
        return { searchResult, nextPageParam };
    },
};

export { userKeys, queryFns };
