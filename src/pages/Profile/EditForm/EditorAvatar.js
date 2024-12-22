import { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import AvatarEditor from 'react-avatar-editor';

import RangeSlider from '~/components/RangeSlider';
import Button from '~/components/Button';
import styles from './EditForm.module.scss';

const cx = classNames.bind(styles);

const EditorAvatar = ({
    imgSrc,
    onClose = () => {},
    onSetPreview = () => {},
    onSetAvatar = () => {},
    onResetInputFile = () => {},
}) => {
    const cropRef = useRef(null);
    const [slideValue, setSlideValue] = useState(10);

    const handleCloseEditorAvatar = () => {
        onResetInputFile();
        onClose();
    };

    const handleApplyAvatar = async () => {
        if (cropRef.current) {
            const dataUrl = cropRef.current.getImage().toDataURL();
            const result = await fetch(dataUrl);
            const blob = await result.blob();
            onSetPreview(URL.createObjectURL(blob));
            onSetAvatar()
            onClose();
        }
        onResetInputFile();
    };

    return (
        <div className={cx('avatar-editor')}>
            <header className={cx('heading')}>
                <div className={cx('btn-back')} onClick={handleCloseEditorAvatar}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </div>
                Edit photo
            </header>
            <main className={cx('avatar-editor-container')}>
                <AvatarEditor
                    ref={cropRef}
                    image={imgSrc}
                    width={360}
                    height={360}
                    // style={{ width: '100%', height: '100%' }}
                    border={50}
                    borderRadius={9999}
                    color={[0, 0, 0, 0.3]}
                    scale={slideValue / 10}
                    rotate={0}
                />

                <div className={cx('slider')}>
                    <span className={cx('slider-label')}>Zoom</span>
                    <RangeSlider
                        min={10}
                        max={100}
                        size="lg"
                        initValue="10"
                        color="#fff"
                        colorLeft="var(--primary)"
                        borderRadius="3px"
                        onInput={(value) => {
                            setSlideValue(value);
                            console.log('value', value);
                        }}
                    />
                </div>
            </main>
            <footer>
                <Button outline onClick={handleCloseEditorAvatar}>Cancel</Button>
                <Button primary onClick={handleApplyAvatar}>
                    Apply
                </Button>
            </footer>
        </div>
    );
};

export default EditorAvatar;
