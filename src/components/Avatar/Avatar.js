import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Avatar.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images';
import { forwardRef } from 'react';

const Avatar = forwardRef(({ className, src, alt, fallback, width, ...props }, ref) => {
    return (
        <Image
            ref={ref}
            className={classNames(styles.avatar, className)} //falsy values are just ignored in libs classNames
            style={{
                width: width,
                height: width,
            }}
            src={src || images.defaultAvatar}
            alt={alt || 'default avt'}
            fallback={fallback || images.noImage}
            {...props}
        />
    );
})

Avatar.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
    width: PropTypes.string,
};

export default Avatar;
