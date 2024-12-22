import { lazy } from 'react';
import config from '~/config';

import Home from '~/pages/Home';
import Following from '~/pages/Following';
import Upload from '~/pages/Upload';
import Profile from '~/pages/Profile';
import Search from '~/pages/Search';
import Friend from '~/pages/Friend';
import Explore from '~/pages/Explore';
import Live from '~/pages/Live';
import VideoModal from '~/pages/VideoModal';
import { DefaultLayout, HeaderOnly, UploadLayout } from '~/layouts';
import ProtectedRoute from './ProtectedRoute';
import SocialAuth from '~/store/auth/SocialAuth';
import NotFound from '~/pages/NotFound';
// const Home = lazy(() => import('~/pages/Home'))
// const Following = lazy(() => import('~/pages/Following'))
// const Upload = lazy(() => import('~/pages/Upload'))
// const Profile = lazy(() => import('~/pages/Profile'))
// const Search = lazy(() => import('~/pages/Search'))
// const Friend = lazy(() => import('~/pages/Friend'))
// const Explore = lazy(() => import('~/pages/Explore'))
// const Live = lazy(() => import('~/pages/Live'))
// const VideoModal = lazy(() => import('~/pages/VideoModal'))

const publicRoutes = [
    { path: config.routes.home, component: Home, isChild: true, page: 'home' },
    { path: config.routes.profile, component: Profile, protectedRoute: ProtectedRoute, isChild: true, page: 'profile' },
    { path: config.routes.following, component: Following },
    { path: config.routes.friends, component: Friend },
    { path: config.routes.explore, component: Explore },
    { path: config.routes.live, component: Live },
    { path: config.routes.search, component: Search },
    { path: config.routes.upload, component: Upload, layout: UploadLayout, protectedRoute: ProtectedRoute },
    // { path: config.routes.userVideo, component: VideoModal, layout: null, protectedRoute: ProtectedRoute }
    // { path: '/test', component: VideoModal, layout: null },
    // { path: '/signup', component: VideoModal, layout: null },
    { path: config.routes.oauth, component: localStorage.getItem('token') ? NotFound : SocialAuth, layout: null },
    { path: config.routes.page404, component: NotFound, layout: null },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
