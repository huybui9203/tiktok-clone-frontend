import useAuth from './useAuth';
import useStore from './useStore';
import { signOut } from '~/store/auth/actions';
import { showForm } from '~/store/actions';
import httpRequest, { removeInterceptor } from '~/utils/httpRequest';
import useToast from './useToast';

const useLogout = (options = { auto : false }) => {
    const auth = useAuth();
    const store = useStore();
    const toast = useToast()

    const handleLogout = () => {
        auth.dispatch(signOut());
        localStorage.removeItem('token');
        delete httpRequest.defaults.headers.common['Authorization'];
        removeInterceptor();
    }

    return () => {
        if (options.auto) {
            handleLogout()
            store.dispatch(showForm());
        } else {
            toast.show('Logout successfully').then(() => {
                handleLogout()
            });
        }
    };
};

export default useLogout;
