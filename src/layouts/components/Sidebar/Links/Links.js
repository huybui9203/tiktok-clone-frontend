import PropTypes from 'prop-types'
import classNames from "classnames/bind"
import styles from './Links.module.scss'

const cx = classNames.bind(styles)

function Links({ data }) {
    return (
        <>
            <h4 className={cx('header')}>{data.title}</h4>
            <div className={cx('wrapper-link')}>
                {data.links.map((link, index) => {
                    return <a className={cx('link')} key={index} href={link.href}>{link.title}</a>
                })}
            </div>
        </>

    )
}

Links.propTypes = {
    data: PropTypes.object.isRequired
}

export default Links