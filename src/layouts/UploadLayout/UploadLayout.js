import classNames from 'classnames/bind';
import Header from '../components/Header';
import styles from './UploadLayout.module.scss';
const cx = classNames.bind(styles);
const UploadLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <div className={cx('container')}>
                <div className={cx('sidebar')}></div>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
};

export default UploadLayout;
