import { useQueryClient } from '@tanstack/react-query';
import { useApiSend, useToast } from '~/hooks';
import { videoKeys, mutationFns } from '../queries';

const useUnfollowAuthor = (videoUuid) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const videoKey = videoKeys.detail
    const currVideoKey = videoKeys.video(videoUuid)

    const updateVideoData = (userData) => {
        queryClient.setQueryData(currVideoKey, oldData => ({
            ...oldData,
            user: {
                ...oldData?.user,
                is_followed: userData.is_followed
            }
        }))
    } 

    const preUpdateVideoData = async () => {
        await queryClient.cancelQueries({ queryKey: currVideoKey });
        const previousVideoData = queryClient.getQueryData(currVideoKey);
        if (previousVideoData) {
            queryClient.setQueryData(currVideoKey, {
                ...previousVideoData,
                user: {
                    ...previousVideoData?.user,
                    is_followed: false
                }
            });
        }

        return { previousVideoData };
    }

  

    return useApiSend(
        videoKey,
        mutationFns.unfollowUser,
        ({ userData }) => {
            updateVideoData(userData)
        },
        (err, variables, context) => {
            console.log(err);
            toast.show(err.message);

             //rollback if fail
             if (context?.previousVideoData) {
                queryClient.setQueryData(currVideoKey, context.previousVideoData);
            }
        },
        true,
        {
            mutationOptions: {
                onMutate: preUpdateVideoData
            }
        }
    );
};

export default useUnfollowAuthor;
