import { useState, memo, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import AccountItem from './AccountItem';
import useListUserAccounts from '../hooks/useListUserAccounts';
import styles from './UserAccounts.module.scss';
import Spinner from '~/components/Spinner';
const cx = classNames.bind(styles);

function SuggestedAccounts() {
    const [isSeeAll, setIsSeeAll] = useState(false);

    const { data, isPending, isFetchingNextPage, fetchNextPage } = useListUserAccounts('suggestion');

    const handleClickMoreBtn = () => {
        if (data.pages.length < 2) {
            //only load 2 page
            if (!isFetchingNextPage) {
                fetchNextPage();
                setIsSeeAll(true);
            }
        } else {
            setIsSeeAll(!isSeeAll);
        }
    };
    const renderUserAccounts = useMemo(() => {
        if (isSeeAll) {
            return data?.pages.map((page, index) => (
                <Fragment key={index}>
                    {page.listSuggestions.map((account) => (
                        <AccountItem key={account.id} data={account} hasPreview />
                    ))}
                </Fragment>
            ));
        } else {
            return data?.pages[0].listSuggestions.map((account) => (
                <AccountItem key={account.id} data={account} hasPreview />
            ));
        }
    }, [data, isSeeAll]);

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('label')}>Suggested accounts</h2>

            {isPending ? (
                <Spinner />
            ) : (
                <>
                    {renderUserAccounts}
                    <p className={cx('more-btn', { loading: isFetchingNextPage })} onClick={handleClickMoreBtn}>
                        {!isFetchingNextPage && isSeeAll ? 'See less' : 'See all'}
                    </p>
                </>
            )}
        </div>
    );
}



export default memo(SuggestedAccounts);
