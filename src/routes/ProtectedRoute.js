import { Navigate, useLocation } from 'react-router-dom';
import Spinner from '~/components/Spinner';
import { useAuth } from '~/hooks';
function ProtectedRoute({ children }) {
    const location = useLocation();
    console.log(location);
    const { authState } = useAuth();
    const { isInitialized, isAuthenticated } = authState;
    if (!isInitialized) {
        return <Spinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to={'/'} replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
