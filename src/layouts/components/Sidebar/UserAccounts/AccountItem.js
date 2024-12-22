import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import styles from './UserAccounts.module.scss';
import AccountPreview from '~/components/AccountPreview';
import Avatar from '~/components/Avatar';
import useFollowAccount from '../hooks/useFollowAccount';
import useUnfollowAccount from '../hooks/useUnfollowAccount';

const cx = classNames.bind(styles);

function AccountItem({ data, hasPreview }) {
    const followUser = useFollowAccount();
    const unfollowUser = useUnfollowAccount()
    const handleFollowAndUnfollowAccount = () => {
        if (data.is_followed) {
            unfollowUser.mutate({ userId: data.id });
        } else {
            followUser.mutate({ userId: data.id });
        }
    };
    const renderPreview = (props) => {
        //props ~ attrs
        return (
            hasPreview && (
                <div tabIndex={-1} {...props}>
                    <PopperWrapper>
                        <AccountPreview data={data} onFollow={handleFollowAndUnfollowAccount} />
                    </PopperWrapper>
                </div>
            )
        );
    };
    return (
        <div>
            <Tippy
                appendTo={() => document.body}
                interactive
                delay={[1000, 0]}
                placement="bottom-start"
                offset={[0, 0]} //tippy is always inside elements that has position attr
                render={renderPreview}
            >
                <div className={cx('account-item')}>
                    <Avatar className={cx('avt')} src={data.avatar} alt={data.nickname} />

                    <div className={cx('item-info')}>
                        <p className={cx('nickname')}>
                            <strong>{data.nickname}</strong>
                            {data.tick && <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />}
                        </p>
                        <p className={cx('name')}>{data.first_name + ' ' + data.last_name}</p>
                    </div>
                </div>
            </Tippy>
        </div>
    );
}

AccountItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default AccountItem;
