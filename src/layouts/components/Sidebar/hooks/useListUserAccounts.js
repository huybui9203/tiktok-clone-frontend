import { useInfiniteQuery } from '@tanstack/react-query';
import { userKeys, queryFns } from '../queries';
import { listUserTypes } from '../constants';

const useListUserAccounts = (filter) => {
    const queryKey = userKeys.list(filter);

    let queryFn = async () => {}
    switch (filter) {
        case listUserTypes.SUGGESTION:
            queryFn = queryFns.listSuggestions
            break
        case listUserTypes.FOLLOWING:
            queryFn =  queryFns.listFollowings
            break
        default:
            throw new Error(`${filter} is invalid type`)
    }

    return useInfiniteQuery({
        queryKey,
        queryFn,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: Infinity,
        refetchInterval: 5 * 60 * 1000,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
    });
};

export default useListUserAccounts;
