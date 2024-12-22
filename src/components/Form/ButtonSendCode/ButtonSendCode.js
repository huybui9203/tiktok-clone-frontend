import classNames from 'classnames/bind';
import Button from '~/components/Button';
import styles from './ButtonSendCode.module.scss';
import Spinner from '~/components/Spinner';
import { memo, useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);

const ButtonSendCode = ({
    disabled = false,
    isSending = false,
    isCounting = false,
    seconds = 10,
    onSendCode = () => {},
    onTimeOut = () => {},
}) => {
    const [count, setCount] = useState(seconds);
    const [label, setLabel] = useState('Send code');
    const timerId = useRef();
    const timeOut = useRef();

    useEffect(() => {
        if (isCounting && count >= 0) {
            if (count === seconds) {
                timeOut.current = Date.now() + seconds * 1000;
                sessionStorage.setItem('code_time_out', timeOut.current)
            }
            if (label === 'Send code') {
                setLabel('Resend code');
            }
            timerId.current = setTimeout(() => {
                setCount((count) => count - 1);
            }, 1000);
        } else if (count < 0) {
            setCount(seconds);
            onTimeOut();
        }

        return () => {
            clearTimeout(timerId.current);
        };
    }, [isCounting, count]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearTimeout(timerId.current);
            } else {
                if (Date.now() <= timeOut.current) {
                    const remainSeconds = Math.floor((timeOut.current - Date.now()) / 1000);
                    setCount(remainSeconds);
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <Button type="button" className={cx('btn', { disabled })} disabled={disabled} onClick={() => onSendCode()}>
            {label}
            {isSending && <Spinner fontSize="16px" className={styles.loading} />}
            {isCounting && <span className={cx('countdown')}>{count}s</span>}
        </Button>
    );
};

export default memo(ButtonSendCode);
