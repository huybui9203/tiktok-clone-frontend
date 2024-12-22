import { useContext } from 'react';
import { AuthContext } from '~/store/auth/AuthProvider';

const useAuth = () => {
    const [authState, dispatch] = useContext(AuthContext);
    return { authState, dispatch };
}
export default useAuth;
