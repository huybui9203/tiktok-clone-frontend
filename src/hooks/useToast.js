import { useContext } from 'react';
import { ToastContext } from '~/contexts/ToastProvider';

function useToast() {
    const { show, remove } = useContext(ToastContext);
    return { show, remove };
}

export default useToast
