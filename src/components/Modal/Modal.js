import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleButtonIcon from '../CircleButtonIcon';
import styles from './Modal.module.scss';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Modal({ className, children, open, onClose, autoHeight }) {
    const handleClose = (e) => {
        e.stopPropagation();
        onClose();
    };
    return (
        <>
            {open && (
                <div
                    className={cx('wrapper', className, {
                        autoHeight,
                    })}
                >
                    <div className={cx('backdrop')} onClick={handleClose}></div>
                    <div className={cx('content-wrapper')}>
                        <div className={cx('div-content')}>
                            <div className={cx('content')}>
                                {children}
                                <CircleButtonIcon
                                    className={cx('btn-close')}
                                    icon={<FontAwesomeIcon icon={faXmark} />}
                                    size={40}
                                    onClick={handleClose}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Modal;
