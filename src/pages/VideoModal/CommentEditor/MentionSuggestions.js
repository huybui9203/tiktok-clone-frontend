import { Fragment, useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import classNames from 'classnames/bind';
import { IconBlueCheck } from '~/components/Icons';
import Avatar from '~/components/Avatar';
import * as searchService from '~/services/searchService';
import { useDebounce, useIsVisible } from '~/hooks';
import Spinner from '~/components/Spinner';
import styles from './CommentEditor.module.scss';
const cx = classNames.bind(styles);

const MentionSuggestions = ({ searchValue, onSelected}) => {
    console.log('mention mount');
    const mentionContainerRef = useRef(null);
    const { isVisible, targetRef: loaderRef } = useIsVisible({
        root: mentionContainerRef.current,
        threshold: 0.5,
    });

    const selectMentionItem = (nickname) => {
        onSelected(nickname)
    }

    const [searchValueDebounced] = useDebounce(searchValue, 800);

    const { data, isLoading, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['search-user', { value: searchValueDebounced }],
        queryFn: async ({ pageParam }) => {
            const data = await searchService.search(searchValueDebounced, {
                type: 'more',
                page: pageParam,
            });

            if (!data) {
                return new Promise.reject('Data is undefined!');
            }

            const { searchResult, pagination } = data;
            const nextPageParam =
                pagination.current_page < pagination.total_pages ? pagination.current_page + 1 : undefined;

            return { searchResult, nextPageParam }; //data.pages = [page, ...]
        },
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
        enabled: searchValueDebounced.length > 0,
    });

    const renderSearchResult = useMemo(() => {
        return data?.pages.map((page, index) => (
            <Fragment key={index}>
                {page.searchResult.map((item) => (
                    <div key={item.id} className={cx('mention-item-wrapper')}>
                        <div className={cx('mention-item')} onClick={() => selectMentionItem(item.nickname)}>
                            <Avatar src={item.avatar} alt={item.nickname} width="40px" />
                            <div className={cx('body')}>
                                <p className={cx('nickname')}>
                                    {item.nickname}
                                    {item.tick && <IconBlueCheck className={cx('check-icon')} />}
                                </p>
                                <p className={cx('name')}>{`${item.first_name} ${item.last_name}`}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Fragment>
        ));
    }, [data]);

    useEffect(() => {
        if (isVisible && !isFetchingNextPage && searchValueDebounced.length > 0) {
            fetchNextPage();
        }
    }, [fetchNextPage, isVisible]);

    return (
        <div
            ref={mentionContainerRef}
            className={cx('list-mentions', { hidden: data?.pages[0].searchResult.length === 0 || !data })}
        >
            {isLoading && (
                <div className={cx('label-searching')}>
                    Searching users <Spinner fontSize="1.8rem" />
                </div>
            )}
            {isSuccess && <>{renderSearchResult}</>}
            <Spinner ref={loaderRef} hidden={!isFetchingNextPage} />
        </div>
    );
};

export default MentionSuggestions;
