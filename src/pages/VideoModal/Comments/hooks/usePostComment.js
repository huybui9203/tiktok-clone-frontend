import { useQueryClient } from '@tanstack/react-query';
import { useApiSend, useToast } from '~/hooks';
import { commentKeys, mutationFns } from '../queries';
import { videoKeys } from '../../queries';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

const usePostComment = (videoId) => {
    const queryClient = useQueryClient();
    const queryKey = commentKeys.list(videoId);
    const videoKey = videoKeys.video(videoId)
    const toast = useToast();

    const addCommentData = (commentData) => {
        queryClient.setQueryData(queryKey, (oldData) => ({
            ...oldData,
            pages: [
                {
                    ...oldData.pages[0],
                    listComments: [commentData, ...oldData.pages[0].listComments],
                    totalComments: oldData.pages[0].totalComments + 1,
                },
                ...oldData.pages.slice(1),
            ],
        }));
    };
    
    const updateVideoData = () => {
        queryClient.setQueryData(videoKey, oldData => {
            return {...oldData, comments_count: oldData.comments_count + 1}
        })
    }

    return useApiSend(
        queryKey,
        mutationFns.postComment,
        ({ commentData, message }) => {
            addCommentData(commentData);
            updateVideoData()
            toast.show(message);
        },
        (err) => {
            toast.show(err.message);
        },
        false,
    );
};

export default usePostComment;
