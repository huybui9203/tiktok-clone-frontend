import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import { HomeIcon, UserArrowLeftIcon, UserGroupIcon, CompassIcon, LiveIcon, HomeIconSolid, UserIcon } from '~/components/Icons';
import config from '~/config';

const cx = classNames.bind(styles);

export const menu = [
    {
        title: 'For You',
        to: config.routes.home,
        icon: [<HomeIcon key={1} />, <HomeIconSolid key={2} />], //add props 'key' to fix warning: "Each child in a list should have a unique "key" prop".

        //cach khac:
        // icon: {
        //     default: <HomeIcon />,
        //     active: <HomeIconSolid />
        // }
    },

    {
        title: 'Following',
        to: config.routes.following,
        icon: <UserArrowLeftIcon />,
    },

    {
        title: 'Friends',
        to: config.routes.friends,
        icon: <UserGroupIcon />,
    },

    {
        title: 'Explore',
        to: config.routes.explore,
        icon: <CompassIcon />,
    },

    {
        title: 'LIVE',
        to: config.routes.live,
        icon: <LiveIcon />,
    },

    {
        title: 'Profile',
        to: '/404?default=guess',
        icon: <UserIcon />,
        hasAvatar: true,
    },
];

export const links = [
    {
        title: 'Company',
        links: [
            {
                title: 'About',
                href: '/',
            },

            {
                title: 'Newsroom',
                href: '/',
            },

            {
                title: 'Contact',
                href: '/',
            },

            {
                title: 'Carees',
                href: '/',
            },
        ],
    },

    {
        title: 'Program',
        links: [
            {
                title: 'TikTok for Good',
                href: '/',
            },

            {
                title: 'Advertise',
                href: '/',
            },

            {
                title: 'TikTok LIVE Creator Networks',
                href: '/',
            },

            {
                title: 'Developers',
                href: '/',
            },

            {
                title: 'Transparency',
                href: '/',
            },

            {
                title: 'TikTok Rewards',
                href: '/',
            },

            {
                title: 'TikTok Embeds',
                href: '/',
            },
        ],
    },

    {
        title: 'Terms & Policies',
        links: [
            {
                title: 'Help',
                href: '/',
            },

            {
                title: 'Safety',
                href: '/',
            },

            {
                title: 'Terms',
                href: '/',
            },

            {
                title: 'Privacy Policy',
                href: '/',
            },

            {
                title: 'Privacy Center',
                href: '/',
            },

            {
                title: 'Creator Academy',
                href: '/',
            },

            {
                title: 'Community Guidelines',
                href: '/',
            },
        ],
    },
];

export const INIT_PAGE = 1;
export const PER_PAGE = 5;
export const LIMIT_PER_PAGE = 20;

export const listUserTypes = {
    SUGGESTION: 'suggestion',
    FOLLOWING: 'following'
}
