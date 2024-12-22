import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useState, forwardRef, useEffect } from 'react';
import images from '~/assets/images';
import styles from './Image.module.scss';

const Image = forwardRef(({ src, alt, className, fallback: customFallback, ...props }, ref) => {
    //solve the issue that's 'forwardRef render functions do not support propTypes or defaultProps'
    const [isError, setError] = useState(false);

    const handleError = () => {
        setError(true);
    };

    useEffect(() => {
        setError(false);
    }, [src]);

    return (
        <img
            ref={ref}
            className={classNames(styles.wrapper, className)}
            loading={'lazy'}
            src={isError ? customFallback || images.noImage : src}
            alt={alt}
            {...props}
            onError={handleError}
        />
    );
});

Image.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    fallback: PropTypes.string,
};

export default Image;
