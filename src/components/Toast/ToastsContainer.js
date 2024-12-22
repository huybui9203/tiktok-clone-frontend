import classNames from 'classnames/bind'
import PropTypes from 'prop-types'
import styles from './Toast.module.scss'
import Toast from "./Toast"

const cx = classNames.bind(styles)

function ToastsContainer({toasts=[]}) {
    return (
        <div className={cx('toasts-container')}>
            {toasts.map((toast) => {
                return <Toast key={toast.id} message={toast.message} id={toast.id}/>
            })}
        </div>
    )
}

ToastsContainer.propTypes = {
    toasts: PropTypes.array.isRequired
}

export default ToastsContainer