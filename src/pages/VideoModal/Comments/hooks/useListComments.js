import { useInfiniteQuery } from '@tanstack/react-query';
import { commentKeys, queryFns } from '../queries';

const useListComments = (videoId, parentId, enabled = true) => {
    const commentKey = parentId ? commentKeys.reply(videoId, parentId) : commentKeys.list(videoId);
    return useInfiniteQuery({
        queryKey: commentKey,
        queryFn: async ({ pageParam }) => await queryFns.getListComments(videoId, pageParam, parentId),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 5000,
        refetchInterval: 5 * 60 * 1000,
        initialPageParam: 1,
        getPreviousPageParam: (firstPage) => firstPage.prevPageParam,
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
        enabled,
    });
};

export default useListComments;
