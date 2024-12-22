import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './Alert.module.scss';
import Button from '../Button';

const cx = classNames.bind(styles);
function Alert({
    isOpen,
    wrapperClassName,
    btnContainerClassName,
    confirmationClassName,
    descriptionClassName,
    confirmation = '',
    description = '',
    confirmBtnLabel = '',
    cancelBtnLabel = '',
    btnHorizontal = false,
    btnWidth = '',
    btnHeight = '',
    onConfirm = () => {},
    onClose = () => {},
}) {
    if (isOpen) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('backdrop')}></div>
                <div
                    className={cx('content', wrapperClassName, {
                        ['btn-horizontal']: btnHorizontal,
                    })}
                >
                    <p className={cx('confirmation', confirmationClassName)}>{confirmation}</p>
                    <p className={cx('description', descriptionClassName)}>{description}</p>
                    <div
                        className={cx('btn-container', btnContainerClassName, {
                            ['btn-horizontal']: btnHorizontal,
                        })}
                    >
                        {btnHorizontal ? (
                            <>
                                <Button
                                    size="lg"
                                    style={{ minWidth: btnWidth, minHeight: btnHeight }}
                                    outline
                                    onClick={() => onClose()}
                                >
                                    {cancelBtnLabel || 'Cancel'}
                                </Button>
                                <Button size="lg" style={{ minWidth: btnWidth, minHeight: btnHeight }} primary={btnHorizontal} onClick={() => onConfirm()}>
                                    {confirmBtnLabel}
                                </Button>
                            </>
                        ) : (
                            <>
                                <button className={cx('btn')} onClick={() => onConfirm()}>
                                    {confirmBtnLabel}
                                </button>

                                <button className={cx('btn')} onClick={() => onClose()}>
                                    {cancelBtnLabel || 'Cancel'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    return <></>;
}

Alert.propTypes = {
    isOpen: PropTypes.bool,
    wrapperClassName: PropTypes.string,
    confirmationClassName: PropTypes.string,
    descriptionClassName: PropTypes.string,
    btnContainerClassName: PropTypes.string,
    confirmation: PropTypes.string,
    confirmBtnLabel: PropTypes.string,
    description: PropTypes.string,
    cancelBtnLabel: PropTypes.string,
    btnHorizontal: PropTypes.bool,
    btnWidth: PropTypes.string,
    btnHeight: PropTypes.string,
    onConfirm: PropTypes.func,
    onClose: PropTypes.func,
};

export default Alert;
