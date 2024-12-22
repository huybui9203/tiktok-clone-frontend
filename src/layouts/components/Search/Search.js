import { useRef, useState, useEffect } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import * as searchService from '~/services/searchService';
import styles from './Search.module.scss';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItem from '~/components/AccountItem';
import { SearchIcon } from '~/components/Icons';
import { useDebounce, useStore } from '~/hooks';
import { useNavigate } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const cx = classNames.bind(styles);

function Search({ transparentStyle, placeholder = 'Search' }) {
    const [searchValue, setSearchValue] = useState('');
    const [showResult, setShowResult] = useState(true);
    const navigate = useNavigate();

    const inputRef = useRef();

    const handleViewAll = () => {
        navigate(`/search?q=${encodeURIComponent(debouncedValue)}`);
        setShowResult(false);
    };

    const handleSearch = () => {
        console.log('click');
        navigate(`/search?q=${encodeURIComponent(searchValue)}`);
        setShowResult(false);
    };

    const handleHideResult = () => {
        setShowResult(false);
    };

    const handleClear = () => {
        setSearchValue('');
        inputRef.current.focus();
        setShowResult(false);
    };

    const handleChange = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
            setShowResult(true);
        }
        setCancel(false);
    };

    const [debouncedValue, setCancel, cancel] = useDebounce(searchValue, 800);

    const { data, isFetching } = useQuery({
        queryKey: ['users', 'list', { filters: debouncedValue.trim() }, { type: 'less' }],
        queryFn: () => searchService.search(debouncedValue, { type: 'less', page: 1 }),
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
        staleTime: 1000,
        gcTime: 5 * 60 * 1000,
        enabled: debouncedValue.trim().length > 0,
    });

    useEffect(() => {
        const inputEle = inputRef.current;

        if (!inputEle) {
            return;
        }

        const handlePressEnter = (e) => {
            if (!searchValue.trim()) {
                return;
            }
            if (e.key === 'Enter' || e.keyCode === 13) {
                setCancel(true);
                navigate(`/search?q=${encodeURIComponent(searchValue)}`);
                setShowResult(false);
            }
        };

        inputEle.addEventListener('keyup', handlePressEnter);
        return () => inputEle.removeEventListener('keyup', handlePressEnter);
    }, [searchValue, navigate]);

    const {
        store: { search },
    } = useStore();

    return (
        //Using a wrapper <div> or <span> tag around the reference
        // element solves this by creating a new parentNode context.
        <div className={cx('search-wrapper')}>
            <HeadlessTippy
                // appendTo={() => document.body}
                interactive
                visible={showResult && data?.searchResult.length > 0}
                render={(attrs) => (
                    <div className={cx('search-result', { transparentStyle })} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Accounts</h4>
                            {data?.searchResult.map((result) => {
                                return <AccountItem key={result.id} data={result} />;
                            })}
                            <div className={cx('view-all')} onClick={handleViewAll}>
                                View all results for "{searchValue}"
                            </div>
                        </PopperWrapper>
                    </div>
                )}
                onClickOutside={handleHideResult}
            >
                <div className={cx('search', { transparentStyle })}>
                    <input
                        ref={inputRef}
                        value={searchValue}
                        placeholder={placeholder}
                        spellCheck="false"
                        onChange={handleChange}
                        onFocus={() => setShowResult(true)}
                    />
                    {searchValue && (cancel ? !search.isLoading : !isFetching) && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {(cancel ? search.isLoading : isFetching) && (
                        <FontAwesomeIcon className={cx('loading')} icon={faCircleNotch} />
                    )}
                    <button className={cx('btn-search')} onClick={handleSearch}>
                        <SearchIcon />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
