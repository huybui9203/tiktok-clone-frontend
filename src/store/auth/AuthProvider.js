import { createContext, useEffect, useReducer } from 'react';
import * as actions from './actions';
import * as authService from '~/services/authService';
import reducer, { initState } from './reducer';
import { useQuery } from '@tanstack/react-query';

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initState);

    useEffect(() => {
        const accessToken = localStorage.getItem('token');
        if (!accessToken) {
            return dispatch(actions.initialize({ isAuthenticated: false, user: null }));
        }

        const fetchData = async () => {
            const userData = await authService.getCurrentUser();
            if (userData) {
                dispatch(actions.initialize({ isAuthenticated: true, user: userData }));
            } else {
                dispatch(actions.initialize({ isAuthenticated: false, user: null }));
            }
        };

        fetchData();
    }, []);

    return <AuthContext.Provider value={[state, dispatch]}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export default AuthProvider;
