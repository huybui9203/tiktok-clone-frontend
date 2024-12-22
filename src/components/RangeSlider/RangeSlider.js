import { forwardRef, useImperativeHandle, useState, useId } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './RangeSlider.module.scss';

const cx = classNames.bind(styles);
const defaultFunc = () => {};

const RangeSlider = forwardRef(
    (
        {
            className,
            initValue = '0',
            colorLeft = '#fff',
            color = 'rgba(255, 255, 255, 0.34)',
            sliderThumbColor = '#fff',
            size = '', //[sm|md|lg]
            borderRadius = '',
            hover = false,
            min = 0,
            max = 100,
            onInput = defaultFunc,
        },
        ref,
    ) => {
        const [value, setValue] = useState(initValue);
        const id = useId();

        useImperativeHandle(ref, () => {
            return {
                getValue() {
                    return value;
                },
                setValue(value) {
                    if (isFinite(value)) {
                        setValue(value);
                    }
                },
            };
        });

        return (
            <div className={cx('wrapper', className)}>
                <input
                    ref={ref}
                    type="range"
                    className={cx('range-slider', {
                        hover,
                        [size]: size,
                        // sliderThumbColor
                    })}
                    name="range-slider"
                    id={'range-slider-' + id}
                    value={value}
                    step={1}
                    min={min}
                    max={max}
                    style={{
                        backgroundImage: `linear-gradient(to right, ${colorLeft} ${
                            ((value - min) / (max - min)) * 100
                        }%, ${color} ${((value - min) / (max - min)) * 100}%)`,
                        backgroundColor: color,
                        borderRadius,
                    }}
                    onInput={(e) => {
                        const currValue = e.target.value;
                        setValue(currValue);
                        onInput(currValue);
                    }}
                />
            </div>
        );
    },
);

RangeSlider.propTypes = {
    className: PropTypes.string,
    initValue: PropTypes.string,
    colorLeft: PropTypes.string,
    color: PropTypes.string,
    sliderThumbColor: PropTypes.string,
    borderRadius: PropTypes.string,
    value: PropTypes.string,
    size: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    hover: PropTypes.bool,
    onInput: PropTypes.func,
};

export default RangeSlider;
