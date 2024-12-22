import classNames from 'classnames/bind';
import styles from './Comments.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import CommentItemWrapper from './CommentItemWrapper';
const cx = classNames.bind(styles);

function CommentReply({ data }) {
    return (
        <div className={cx('reply')}>
            {data.map(item => {
                return <CommentItemWrapper key={item.id} data={item}/>
            })}
            <p className={cx('view-reply')}>
                <span>View 100 replies</span>
                <FontAwesomeIcon icon={faAngleDown} />
            </p>
        </div>
    );
}

export default CommentReply;
