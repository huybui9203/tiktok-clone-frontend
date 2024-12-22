import { useQueryClient } from '@tanstack/react-query';
import { useApiSend, useToast } from '~/hooks';
import { videoKeys, mutationFns } from '../queries';

const useUnlikeVideo = (videoUuid) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const queryKey = videoKeys.video(videoUuid);

    const preUpdate = async () => {
        await queryClient.cancelQueries({ queryKey });
        const previousVideoData = queryClient.getQueryData(queryKey);
        if (previousVideoData) {
            queryClient.setQueryData(queryKey, {
                ...previousVideoData,
                is_liked: false,
                likes_count: previousVideoData.likes_count - 1,
            });
        }

        return { previousVideoData };
    }

    return useApiSend(
        queryKey,
        mutationFns.unLikeVideo,
        ({ videoData, message }) => {
            queryClient.setQueryData(queryKey, videoData);
            if (message) {
                toast.show(message);
            }
        },
        (err, variables, context) => {
            console.log(err);
            toast.show(err.message);

            //rollback if fail
            if (context?.previousVideoData) {
                queryClient.setQueryData(queryKey, context.previousVideoData);
            }
        },
        false,
        {
            mutationOptions: {
                onMutate: preUpdate,
            },
        },
    );
};

export default useUnlikeVideo;
