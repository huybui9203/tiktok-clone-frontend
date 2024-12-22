import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Avatar from '~/components/Avatar';
import { IconBlueCheck } from '~/components/Icons';
import { linkToRoute as to } from '~/config/routes';
import styles from './AccountItem.module.scss';
const cx = classNames.bind(styles);

const AccountItem = ({ data }) => {
    return (
        <Link className={cx('wrapper')} to={to.profile(data.nickname)}>
            <Avatar className={cx('avatar')} width="6rem" src={data.avatar} alt={data.nickname} />
            <div className={cx('body')}>
                <span className={cx('nickname')}>
                    {data.nickname}
                    {data.tick && <IconBlueCheck className={cx('icon-check')} />}
                </span>
                <p className={cx('user-name')}>
                    {`${data.first_name} ${data.last_name}`} &middot;
                    <span className={cx('count-follows')}>{data.followers_count}</span>
                    Followers
                </p>
                <span className={cx('user-bio')}>{data.bio}</span>
            </div>
        </Link>
    );
};

AccountItem.propTypes = {
    data: PropTypes.object.isRequired
}

export default AccountItem;
