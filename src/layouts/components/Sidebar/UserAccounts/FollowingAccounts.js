import { useState, memo, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import AccountItem from './AccountItem';
import useListUserAccounts from '../hooks/useListUserAccounts';
import styles from './UserAccounts.module.scss';
import Spinner from '~/components/Spinner';
const cx = classNames.bind(styles);

function FollowingAccounts() {
    const [isSeeMore, setSeeMore] = useState(false);
    const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } = useListUserAccounts('following');

    const handleClickMoreBtn = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
            setSeeMore(true);
        }
        if (!hasNextPage) {
            setSeeMore(!isSeeMore);
        }
    };
    const renderUserAccounts = useMemo(() => {
        if (isSeeMore) {
            return data?.pages.map((page, index) => (
                <Fragment key={index}>
                    {page.listFollowings.map((account) => (
                        <AccountItem key={account.id} data={account} />
                    ))}
                </Fragment>
            ));
        } else {
            return data?.pages[0].listFollowings.map((account) => <AccountItem key={account.id} data={account} />);
        }
    }, [data, isSeeMore]);

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('label')}>Following accounts</h2>

            {isPending ? (
                <Spinner />
            ) : (
                <>
                    {renderUserAccounts}
                    <p className={cx('more-btn', { loading: isFetchingNextPage })} onClick={handleClickMoreBtn}>
                        {hasNextPage || !isSeeMore ? 'See more' : 'See less'}
                    </p>
                </>
            )}
        </div>
    );
}

export default memo(FollowingAccounts);
