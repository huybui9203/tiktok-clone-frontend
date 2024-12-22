import { useInfiniteQuery } from '@tanstack/react-query';
import { userKeys, queryFns } from '../queries';
const useListUserAccounts = (filter) => {
    const queryKey = userKeys.listType(filter, 'more');
    return useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam }) => await queryFns.getListUsers(filter, pageParam),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: Infinity,
        refetchInterval: 5 * 60 * 1000,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
    });
};

export default useListUserAccounts;
