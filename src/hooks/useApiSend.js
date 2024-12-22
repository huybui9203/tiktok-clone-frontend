import { useMutation, useQueryClient } from '@tanstack/react-query';

const useApiSend = (
    queryKey = [],
    mutationFn = async () => {},
    success = () => {},
    error = () => {},
    isInvalidateQueries = true,
    options = { mutationOptions: {}, invalidateQueriesOptions: {} },
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: (data) => {
            if (isInvalidateQueries) {
                queryClient.invalidateQueries({ queryKey, ...options.invalidateQueriesOptions });
            }
            success(data);
        },
        onError: error,
        retry: 2,
        ...options.mutationOptions,
    });
};

export default useApiSend;
