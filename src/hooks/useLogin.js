import { signIn } from '~/store/auth/actions';
import useAuth from './useAuth';
import useToast from './useToast';

const useLogin = () => {
    const { dispatch } = useAuth();
    const toast = useToast()
    
    return (userData) => {
        // toast.show('Login successfully').then(() =>{
            
        // })
        dispatch(signIn({ user: userData }));
            const accessToken = userData.meta.token;
            const methodLogin = userData.meta.method
            localStorage.setItem('token', accessToken);
            localStorage.setItem('last_login', methodLogin);
    };
};

export default useLogin;
