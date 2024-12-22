import { useEffect } from 'react'
import PropTypes from 'prop-types'
import styles from './Toast.module.scss'
import { useToast } from '~/hooks'

const DELAY = 2200 
function Toast({ id, message='' }) {
    const toast = useToast()
    const autoClose = () => {
        toast.remove(id)
    }

    useEffect(() => {
        const timeId = setTimeout(autoClose, DELAY)
        return () => clearTimeout(timeId)
    }, [])

    return (
        <div className={styles.toast}>
            {message}
        </div>
    )
}

Toast.propTypes = {
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired
}

export default Toast