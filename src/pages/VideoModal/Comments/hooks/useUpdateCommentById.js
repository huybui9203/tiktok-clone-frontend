import { useQueryClient } from '@tanstack/react-query';
import { useApiSend, useToast } from '~/hooks';
import { commentKeys } from '../queries';

const useUpdateCommentById = (videoUuid, mutationFn) => {
    const toast = useToast();
    const queryClient = useQueryClient();
    const queryKey = commentKeys.list(videoUuid);

    const updateCommentData = (commentData, id) => {
        queryClient.setQueryData(queryKey, (oldData) => {
            const newPages = oldData.pages.map((page) => {
                const newLisComments = page.listComments.map((commentItem) =>
                    commentItem.id === id ? commentData : commentItem,
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
        queryKey,
        mutationFn,
        ({ commentData, message }) => {
            updateCommentData(commentData, commentData.id);
            if(message) {
                toast.show(message);
            }
        },
        (err) => {
            console.log(err);
            toast.show(err.message);
        },
        false
    );
};

export default useUpdateCommentById;
