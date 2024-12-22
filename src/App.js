import { Fragment, Suspense, useEffect, useRef, useState } from 'react';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '~/routes';
import DefaultLayout from '~/layouts';

import Modal from '~/components/Modal';
import { useLogout, useStore } from '~/hooks';
import Form from '~/components/Form';
import { actions } from '~/store';
import VideoModal from './pages/VideoModal';
import { ToastContainer as ToastWrapper, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosInterceptor } from './utils/httpRequest';
import { showForm } from './store/actions';
import ProtectedRoute from './routes/ProtectedRoute';

const queryClient = new QueryClient({
    // defaultOptions: {
    //     queries: {
    //         refetchOnWindowFocus: false
    //     }
    // },
    queryCache: new QueryCache({
        //notification for queries
        onSuccess: () => {},
        onError: () => {},
    }),
    mutationCache: new MutationCache({
        onSuccess: () => {},
        onError: () => {},
    }),

    //use 'meta' to choose queries has notification
});

function App() {
    //re-render when route change
    const { pathname, state } = useLocation(); //useLocation() may be used only in the context of a <Router> component
    console.log('app');

    const navigate = useNavigate();
    const {
        store: { form },
        dispatch,
    } = useStore();

    const logout = useLogout({ auto: true });

    const runInterceptor = useRef(null);

    if (!runInterceptor.current) {
        AxiosInterceptor(logout);
        runInterceptor.current = true;
    }

    const handleCloseForm = () => {
        document.title = 'TikTok - Make Your Day';
        dispatch(actions.hideForm());
    };

    useEffect(() => {
        window && window.scrollTo(0, 0);
    }, [pathname]);

    let page = 'home';

    if (['/'].includes(pathname)) {
        page = 'home';
    }

    if (/^\/([^\/\s]+)$/.test(pathname)) {
        page = 'profile';
    }

    useEffect(() => {
        if (state?.showLogin) {
            navigate('/', { replace: true });
            dispatch(showForm());
        }
    }, [state?.showLogin]);

    return (
        <QueryClientProvider client={queryClient}>
            {/* <Router> */}
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Layout = route.layout === null ? Fragment : route.layout || DefaultLayout;
                        const Page = route.component;
                        const Protector = route.protectedRoute === undefined ? Fragment : route.protectedRoute;
                        // console.log('calc route');
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Protector>
                                        <Layout>
                                            {/* <Suspense fallback={<Spinner fontSize='2rem'/>}> */}
                                            <Page />
                                            {/* </Suspense> */}
                                        </Layout>
                                    </Protector>
                                }
                            >
                                {route.isChild && route.page === page && (
                                    <Route
                                        path="/:username/video/:uuid"
                                        element={
                                            <ProtectedRoute>
                                                <VideoModal modal />
                                            </ProtectedRoute>
                                        }
                                    />
                                )}
                                {/* {route.isChild && path === '/' && <Route path='/:nickname/video/:uuid' element={VideoModal} />} */}
                            </Route>
                        );
                    })}
                </Routes>

                <Modal open={form.isShow} onClose={handleCloseForm}>
                    <Form onClose={handleCloseForm} />
                </Modal>
                <ToastWrapper style={{ zIndex: 100000 }} />
            </div>
            {/* </Router> */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
