import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiSend, useToast } from '~/hooks';
import { videoKeys, userKeys } from '~/utils/queryKeys';
import { queryFns } from '../queries';

const useFollowAccount = () => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const videoKey = videoKeys.all;
    const userKey = userKeys.lists();

    return useMutation({
        mutationFn: queryFns.followUser,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: videoKey });
            queryClient.invalidateQueries({ queryKey: userKey });
        },
        onError: (err) => {
            toast.show(err.message)
        }
    });
};

export default useFollowAccount;

//has follow: video, videos list, comments list, suggestions, following
/**
 * video: ['videos', 'detail']
 * videos list: ['videos', 'list]
 * comments list: ['videos', detail, uuid, 'comments']
 * suggestions: ['users', 'list', {filter: 'suggestion'}]
 * followings: ['users', 'list', {filter: 'following'}]
 */
