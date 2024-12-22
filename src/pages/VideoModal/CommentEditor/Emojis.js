import classNames from 'classnames/bind';
import styles from './CommentEditor.module.scss';
const cx = classNames.bind(styles);
const emojis = [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '😍',
    '😘',
    '😗',
    '😚',
    '😙',
    '😋',
    '😛',
    '😜',
    '😝',
    '🤑',
    '🤗',
    '🤔',
    '🤐',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '🤥',
    '😌',
    '😔',
    '😪',
    '🤤',
    '😴',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤧',
    '😵',
    '🤠',
    '😎',
    '🤓',
    '😕',
    '😟',
    '🙁',
    '😮',
    '😯',
    '😲',
    '😳',
    '😦',
    '😧',
    '😨',
    '😰',
    '😥',
    '😢',
    '😭',
    '😱',
    '😖',
    '😣',
    '😞',
    '😓',
    '😩',
    '😫',
    '😤',
    '😡',
    '😠',
    '😈',
    '👿',
    '💀',
    '💩',
    '🤡',
    '👹',
    '👺',
    '👻',
    '👽',
    '👾',
    '🤖',
    '😺',
    '😸',
    '😹',
    '😻',
    '😼',
    '😽',
    '🙀',
    '😿',
    '😾',
];
function Emojis({ onSelected }) {
    const handleClickImoji = (emoji) => {
        onSelected(emoji)
    }
    return (
        <div className={cx('emoji-wrapper')}>
            <ul className={cx('list-emoji')}>
                {emojis.map((emoji, index) => {
                    return <li className={cx('emoji-item')} key={index} onClick={() => handleClickImoji(emoji)}>{emoji}</li>
                })}
            </ul>
        </div>
        
    )
}

export default Emojis;
