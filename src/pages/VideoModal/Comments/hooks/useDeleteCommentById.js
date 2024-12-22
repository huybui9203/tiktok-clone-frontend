import { useQueryClient } from '@tanstack/react-query';
import { useApiSend, useToast } from '~/hooks';
import { commentKeys, mutationFns } from '../queries';
import { videoKeys } from '../../queries';

const useDeleteCommentById = (videoUuid) => {
    const queryClient = useQueryClient();
    const queryKey = commentKeys.list(videoUuid);
    const videoKey = videoKeys.video(videoUuid)
    const toast = useToast();

    const removeComment = (id) => {
        queryClient.setQueryData(queryKey, (oldData) => {
            const newPages = oldData.pages.map((page) => {
                const newLisComments = page.listComments.filter((commentItem) => commentItem.id !== id);
                return {
                    ...page,
                    listComments: newLisComments,
                    totalComments: page.totalComments - 1
                };
            });
            return {
                pages: newPages,
                pageParams: oldData.pageParams,
            };
        });
    };

    const updateVideoData = () => {
        queryClient.setQueryData(videoKey, oldData => {
            return {...oldData, comments_count: oldData.comments_count - 1}
        })
    }

    return useApiSend(
        queryKey,
        mutationFns.deleteComment,
        ({ id, message }) => {
            removeComment(id);
            updateVideoData()
            toast.show(message); 
        },
        (err) => {
            console.log(err);
            toast.show(err.message);
        },
        false
    );
};

export default useDeleteCommentById;
