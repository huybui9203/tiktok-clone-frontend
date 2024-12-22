import { Fragment, memo, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Comments.module.scss';
import CommentItem from './CommentItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { useListComments } from './hooks';
const cx = classNames.bind(styles);

function CommentItemWrapper({ data, reply }) {
    const [isShowListReplies, setShowListReplies] = useState(false);
    const [showViewReply, setShowViewReply] = useState(true);

    // console.log(testData)
    // const bfs = (array) => {
    //     let queue = [...array];
    //     let length = queue.length;
    //     while (queue.length !== 0) {
    //         const first = queue.shift();
    //         if (first.replies) {
    //             length += first.replies.length;
    //             queue = [...queue, ...first.replies];
    //         }
    //     }

    //     return length;
    // };

    const {
        data: listReplies,
        isPending,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useListComments(data?.video_id, data?.id, isShowListReplies);
    console.log('REPLY', listReplies);

    const renderListReplies = useMemo(() => {
        return listReplies?.pages.map((page, index) => (
            <Fragment key={index}>
                {page.listComments.map((comment) => (
                    <CommentItemWrapper key={comment.id} data={comment} reply />
                ))}
            </Fragment>
        ));
    }, [listReplies]);

    const handleViewReplies = async () => {
        setShowListReplies(true);
        setShowViewReply(false);
        // console.log('COMMENT', data?.id);
    };

    // const totalsRelies = useMemo(() => {
    //     if (listReplies) {
    //         return listReplies.pages[0]?.totalComments
    //     }
    // }, [listReplies]);
    console.log('REPLIES COUNT',data?.replies_count, listReplies)
    return (
        <div className={cx('item-wrapper')}>
            <CommentItem data={data} reply={reply} />
            {!!data?.replies_count && (
                // <CommentReply data={data.children}/>
                <div className={cx('reply-container')} style={{ paddingLeft: reply ? '36px' : '52px' }}>
                    {isShowListReplies && renderListReplies}
                    <p className={cx('reply-action')}>
                        {showViewReply && (
                            <span onClick={handleViewReplies}>
                                {data?.replies_count === 1 ? `View ${data?.replies_count} reply` : `View ${data?.replies_count} replies`}
                                <FontAwesomeIcon className={cx('reply-action-icon')} icon={faAngleDown} />
                            </span>
                        )}

                        {!showViewReply && !reply && (
                            <span
                                className={cx('btn-hide-reply')}
                                onClick={() => {
                                    setShowListReplies(false);
                                    setShowViewReply(true);
                                }}
                            >
                                Hide
                                <FontAwesomeIcon className={cx('reply-action-icon')} icon={faAngleUp} />
                            </span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}

export default memo(CommentItemWrapper);
