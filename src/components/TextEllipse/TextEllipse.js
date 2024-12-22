import classNames from 'classnames';
import styles from './TextEllipse.module.scss';

function TextEllipse({ children, line, className, ...props }) {
    //line = -1 => ignore ellipse
    return (
        <span
            className={classNames(styles.wrapper, className)}
            style={{ WebkitLineClamp: line, display: line === -1 ? 'block' : '-webkit-box' }}
            {...props}
        >
            {children}
        </span>
    );
}

export default TextEllipse;
