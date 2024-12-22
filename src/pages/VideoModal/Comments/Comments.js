import styles from './Comments.module.scss';
import CommentItemWrapper from './CommentItemWrapper';
import { Fragment, memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import Spinner from '~/components/Spinner';
import { useIsVisible } from '~/hooks';

import { testData } from './testMultiLevelComment';
import useVideoModal from '../hooks/useVideoModal';
import { useListComments } from './hooks';


function Comments() {
    const commentContainerRef = useRef(null);
    const { isVisible, targetRef: loaderRef } = useIsVisible({
        root: commentContainerRef.current,
        rootMargin: '0px 0px -86px 0px',
        threshold: 0.5,
    });

    const { videoId, setTotalComments } = useVideoModal();

    const {
        data,
        isPending,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useListComments(videoId);
   
    useLayoutEffect(() => {
        const totalComments = data?.pages[0].totalComments;
        setTotalComments(totalComments === undefined ? undefined : totalComments);
    }, [data]);

    const renderListComments = useMemo(() => {
        return data?.pages.map((page, index) => (
            <Fragment key={index}>
                {page.listComments.map((commentItem) => (
                    <CommentItemWrapper key={commentItem.id} data={commentItem} testData={testData} />
                ))}
            </Fragment>
        ));
    }, [data]);

    useEffect(() => {
        if (isVisible && !isFetchingNextPage) {
            fetchNextPage();
        } else {
        }
    }, [fetchNextPage, isVisible]);

    return (
        <div ref={commentContainerRef} className={styles.wrapper}>
            {isPending ? (
                <>
                    <p>Loading comment...</p>
                </>
            ) : (
                <>
                    {renderListComments}
                    
                </>
            )}
            <Spinner ref={loaderRef} fontSize="1.8rem" hidden={!isFetchingNextPage} />
        </div>
    );
}

export default memo(Comments);
