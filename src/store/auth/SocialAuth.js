import { useApiSend, useAuth, useLogin } from '~/hooks';
import * as authService from '~/services/authService';
import { useToast } from '~/hooks';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const SocialAuth = () => {
    const [searchParams] = useSearchParams();
    const socialId = searchParams.get('id');
    const tokenAuth = searchParams.get('token');
    const authentication = searchParams.get('authentication');
    const reason = searchParams.get('reason');
    const socialType = searchParams.get('social');

    const navigate = useNavigate();
    const login = useLogin();
    const toast = useToast();
    const {
        authState: { user },
    } = useAuth();

    useEffect(() => {
        let ignore = true;

        if (!socialId || !tokenAuth || socialType !== 'google') {
            return;
        }
        const fetchData = async () => {
            const data = await authService.loginWithGoogle(socialId, tokenAuth, socialType);
            
            if (!ignore) {
                
                if (!data) {
                    console.log('DATA failed:::::::', data)
                    toast.show('Login with Google failed').then(() => {
                        navigate('/', { replace: true });
                    });
                    return
                }
                toast.show('Login with Google successfull').then(() => {
                    navigate('/', { replace: true });
                    login(data);
                });
                console.log('DATA success:::::::', data)
            }
        };

        fetchData();

        return () => {
            ignore = false;
        };
    }, []);

    useEffect(() => {
        let ignore = true;

        if (!socialId || !tokenAuth || socialType !== 'facebook') {
            return;
        }
        const fetchData = async () => {
            const data = await authService.loginWithFacebook(socialId, tokenAuth, socialType);
            
            if (!ignore) {
                
                if (!data) {
                    console.log('DATA failed:::::::', data)
                    toast.show('Login with Facebook failed').then(() => {
                        navigate('/', { replace: true });
                    });
                    return
                }
                toast.show('Login with Facebook successfull').then(() => {
                    navigate('/', { replace: true });
                    login(data);
                });
                console.log('DATA success:::::::', data)
            }
        };

        fetchData();

        return () => {
            ignore = false;
        };
    }, []);


    if (socialId && tokenAuth) {
        <></>;
    }
    if (authentication === 'failure') {
        return (
            <>
                {reason === 'email-exist' && <h1>Email has already signed up</h1>}
                {['server-error', null].includes(reason) && <h1>An error occurred while authenticating with Google</h1>}
                <Link to={'/'} replace={true}>
                    Continue without login
                </Link>
                <div></div>
                <Link to={'/'} replace={true} state={{ showLogin: 'show' }}>
                    Try another one
                </Link>
            </>
        );
    }

    // const isLogin = useRef(null)
    // const { isSuccess, mutate } = useApiSend(
    //     null,
    //     async ({socialId, tokenAuth}) => {
    //        const data = await authService.loginWithGoogle(socialId, tokenAuth);
    //        if(!data) {
    //         return new Promise.reject(new Error('Authentication failed'))
    //        }
    //        return data
    //     },
    //     (data) => {
    //         login(data);
    //     },
    //     (err) => {
    //         toast.show('Login with Google failed');
    //     },
    //     false,
    // );

    // if(!isLogin.current) {
    //     isLogin.current = true
    //     mutate({socialId, tokenAuth})
    // }

    // if (user) {
    //     return <Navigate to="/" replace={true} />;
    // }

    // if (isSuccess) return <Navigate to="/" replace={true} />;

    // return (
    //     <>
    //         {/* <h1>Lỗi xác thực</h1>
    //         <Link to={'/'} replace={true}>
    //             Quay lại trang chủ
    //         </Link>

    //         <Link to={'/'} replace={true} state={{showLogin: "show"}}>
    //             Thử một phương thức đăng nhập khác
    //         </Link> */}
    //         {isSuccess && <Navigate to="/" replace={true} state={{loginSuccess: true}}/>}
    //     </>
    // );
};

export default SocialAuth;
//http://localhost:3000/oauth?social=google&id=108089330899698793909&token=e04534d1-c9eb-4aa9-86d5-164ce3c8015e
