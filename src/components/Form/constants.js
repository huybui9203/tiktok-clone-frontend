import { UserIcon, FacebookIcon, GoogleIcon } from '../Icons';

const formTypes = {
    LOGIN: 'log in',
    SIGNUP: 'sign up',
};

const EMAIL = 'email';
const FACEBOOK = 'facebook';
const GOOGLE = 'google';

const LENGTH_CODE = 6;

const listOptionsLogin = [
    { text: 'Use email', icon: <UserIcon width="2rem" />, type: EMAIL },
    { text: 'Continue with Facebook', icon: <FacebookIcon />, type: FACEBOOK },
    { text: 'Continue with Google', icon: <GoogleIcon />, type: GOOGLE },
];

const listOptionsSignup = [
    { text: 'Use email', icon: <UserIcon width="2rem" />, type: EMAIL },
    { text: 'Continue with Facebook', icon: <FacebookIcon />, type: FACEBOOK },
    { text: 'Continue with Google', icon: <GoogleIcon />, type: GOOGLE },
];

const validMailDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];

const MONTHS = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};

const ALLOWED_AGE = 6;
const CODE_EXPIRES = 60

export {
    formTypes,
    listOptionsLogin,
    listOptionsSignup,
    validMailDomains,
    FACEBOOK,
    EMAIL,
    GOOGLE,
    LENGTH_CODE,
    MONTHS,
    ALLOWED_AGE,
    CODE_EXPIRES
};
