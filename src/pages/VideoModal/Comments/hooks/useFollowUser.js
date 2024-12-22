import { useQueryClient } from '@tanstack/react-query';
import { useApiSend, useToast } from '~/hooks';
import { commentKeys, mutationFns } from '../queries';
import { videoKeys } from '../../queries';

const useFollowUser = (videoUuid) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const queryKey = commentKeys.list(videoUuid);
    const videoKey = videoKeys.detail

    const updateCommentsHasUserId = (userData) => {
        queryClient.setQueryData(queryKey, (oldData) => {
            const newPages = oldData.pages.map((page) => {
                const newLisComments = page.listComments.map((commentItem) =>
                    commentItem.user.id === userData.id ? { ...commentItem, user: userData } : commentItem,
                );
                return {
                    ...page,
                    listComments: newLisComments,
                };
            });
            return {
                ...oldData,
                pages: newPages,
            };
        });
    };

    return useApiSend(
        videoKey,
        mutationFns.followUser,
        ({ userData }) => {
            updateCommentsHasUserId(userData);
        },
        (err) => {
            console.log(err);
            toast.show(err.message);
        },
        true,
    );
};

export default useFollowUser;
