import { useInfiniteQuery } from '@tanstack/react-query';
import { profileKeys, queryFns } from '../queries';

const useProfile = (username) => {
    const queryKey = profileKeys.profile(username);
    return useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam }) => await queryFns.getProfile(username, pageParam),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        staleTime: Infinity,
        retry: false,
        // refetchInterval: 5 * 60 * 1000,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
    });
};

export default useProfile;
