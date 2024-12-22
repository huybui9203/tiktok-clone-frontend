import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleQuestion,
    faEarthAsia,
    faGear,
    faKeyboard,
    faRightFromBracket,
    faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark, faUser, faLightbulb, faMoon } from '@fortawesome/free-regular-svg-icons';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';

const menuActions = {
    LOG_OUT: 'log_out',
    SWITCH_MODE: 'switch_mode',
}

const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faEarthAsia} />,
        title: 'English',
        children: {
            title: 'Language',
            data: [
                {
                    code: 'en',
                    title: 'English',
                },

                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },

                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },

                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },

                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },

                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },

                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },

                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
                {
                    code: 'en',
                    title: 'English',
                },

                {
                    code: 'vi',
                    title: 'Tiếng Việt',
                },
            ],
        },
    },

    {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: 'Feedback and help',
        to: '/feedback',
    },

    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Keyboard shortcuts',
    },
];

const userMenu = [
    {
        icon: <FontAwesomeIcon icon={faUser} />,
        title: 'View profile',
        to: '/@hhuy',
    },

    {
        icon: <FontAwesomeIcon icon={faBookmark} />,
        title: 'Favorites',
        to: '/favorites',
    },

    {
        icon: <FontAwesomeIcon icon={faTiktok} />,
        title: 'Get Coins',
        to: '/coins',
    },

    {
        icon: <FontAwesomeIcon icon={faVideo} />,
        title: 'LIVE Studio',
        to: '/live-studio',
    },

    {
        icon: <FontAwesomeIcon icon={faLightbulb} />,
        title: 'LIVE Creator Hub',
        to: '/live-creator-hub',
    },

    {
        icon: <FontAwesomeIcon icon={faGear} />,
        title: 'Settings',
        to: '/settings',
    },
    ...MENU_ITEMS,

    {
        icon: <FontAwesomeIcon icon={faMoon} />,
        action: menuActions.SWITCH_MODE,
        title: 'Dark mode',
        switchBtn: true,
    },

    {
        icon: <FontAwesomeIcon icon={faRightFromBracket} />,
        action: menuActions.LOG_OUT,
        title: 'Log out',
        to: '/',
        separate: true,
    },
];


export { MENU_ITEMS, userMenu, menuActions }
