import { Fragment, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { Tab, Tabs } from '~/components/Tabs';
import AccountItem from './AccountItem/AccountItem';
import useListUserAccounts from './hooks/useListUserAccounts';
import Spinner from '~/components/Spinner';
import { useIsVisible, useStore } from '~/hooks';
import styles from './Search.module.scss';
import { actions } from '~/store';
const cx = classNames.bind(styles);
function Search() {
    const listUserAccountsRef = useRef(null);
    const { isVisible, targetRef: loaderRef } = useIsVisible({
        root: listUserAccountsRef.current,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.5,
    });

    const [searchParams] = useSearchParams();
    const searchValue = searchParams.get('q');

    const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } = useListUserAccounts(searchValue);
    const renderListUserAccounts = useMemo(() => {
        return data?.pages.map((page, index) => (
            <Fragment key={index}>
                {page.searchResult.map((accountItem) => (
                    <AccountItem key={accountItem.id} data={accountItem} />
                ))}
            </Fragment>
        ));
    }, [data]);

    const {
        store: { search },
        dispatch
    } = useStore();

    
    useEffect(() => {
        dispatch(actions.setSearchIsLoading(isPending))
    }, [isPending])

    useEffect(() => {
        if (isVisible && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isVisible, fetchNextPage]);

    return (
        <div className={cx('wrapper')}>
            <Tabs lineTransition>
                <Tab label="Users" ratioX={1} />
                <Tab label="Videos" ratioX={1} />
                <Tab label="example" ratioX={1} />
                <Tab label="example" ratioX={1} />
            </Tabs>
            <div ref={listUserAccountsRef} className={cx('list-user')}>
                {isPending && (
                    <Skeleton className={cx('skeleton')} width={window.innerWidth / 2} height={96} count={10} />
                )}
                {renderListUserAccounts}
                {!hasNextPage && data?.pages.length > 1 && <p>No more users to load</p>}
                <Spinner ref={loaderRef} fontSize="2rem" hidden={!hasNextPage} />
            </div>
        </div>
    );
}

export default Search;
