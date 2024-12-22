import { useInfiniteQuery } from '@tanstack/react-query';
import { videoKeys, queryFns } from '../queries';

const useListVideos = ({ type }) => {
    const videoKey = videoKeys.list(type);
    return useInfiniteQuery({
        queryKey: videoKey,
        queryFn: queryFns.getListVideos,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: 5000,
        refetchInterval: 5 * 60 * 1000,
        initialPageParam: 1,
        // getPreviousPageParam: (firstPage) => firstPage.prevPageParam,
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
    });
};

export default useListVideos;
