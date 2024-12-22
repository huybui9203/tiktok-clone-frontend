import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import styles from './AccountItem.module.scss';
import { Link } from 'react-router-dom';
import Avatar from '~/components/Avatar';
import { IconBlueCheck } from '~/components/Icons';
import { linkToRoute as to } from '~/config/routes';
const cx = classNames.bind(styles);

function AccountItem({ data, className }) {
    return (
        <Link to={to.profile(data.nickname)} className={cx('wrapper', className)}>
            <Avatar className={cx('avatar')} width={'40px'} src={data.avatar} alt={data.full_name} />
            <div className={cx('body')}>
                <p className={cx('username')}>
                    <span>{data.nickname}</span>
                    {data.tick && <IconBlueCheck />}
                </p>

                <p className={cx('name')}>
                    <span>{data.full_name}</span>
                </p>
            </div>
        </Link>
    );
}

AccountItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default AccountItem;
