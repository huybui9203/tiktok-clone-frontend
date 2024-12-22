import classNames from "classnames/bind";
import styles from './Tabs.module.scss'
import { forwardRef, useRef } from "react";
const cx = classNames.bind(styles)

const Tab = forwardRef(({ label, iconLeft, iconRight, ratioX }, ref) => {

    return (
        <div ref={ref} className={cx('tab')} style={{flex: ratioX}}>
            {iconLeft && <span className={cx('icon')}>{iconLeft}</span>}
            <span>{label}</span>
            {iconRight && <span className={cx('icon')}>{iconRight}</span>}
        </div>
    )
})

export default Tab