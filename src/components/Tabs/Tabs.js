import classNames from 'classnames/bind';
import styles from './Tabs.module.scss';
import { useLayoutEffect, useRef } from 'react';
const cx = classNames.bind(styles);

function Tabs({
    className,
    children,
    fontSize,
    lineTransition,
    defaultColor = 'rgb(115, 116, 123)',
    activeColor = 'var(--text-color)',
    onSelectedTab=() => {}
}) {
    const tabsRef = useRef(null);
    const bottomLineRef = useRef(null);

    const handleMouseOver = (e) => {
        const tabs = tabsRef.current;
        const bottomLine = bottomLineRef.current;
        if (!bottomLine) {
            return;
        }
        if (!tabs) {
            return;
        }
        const listTabs = [...tabs.children].slice(0, -1);
        listTabs.forEach((tab) => {
            if (tab && tab.matches(':hover')) {
                bottomLine.style.width = `${tab.offsetWidth}px`;
                bottomLine.style.transform = `translateX(${tab.offsetLeft}px)`;
            }
        });
    };

    const handleMouseOut = (e) => {
        const tabs = tabsRef.current;
        if (!tabs) {
            return;
        }
        const tabActive = tabs.querySelector('.active');
        if (tabActive) {
            setActive(tabActive);
        }
    };

    const handleClick = (e) => {
        const tabs = tabsRef.current;
        if (!tabs) {
            return;
        }
        const listTabs = [...tabs.children].slice(0, -1);

        listTabs.forEach((tab, index) => {
            tab.classList.remove('active');
            tab.style.color = defaultColor;

            if (tab && tab.matches(':hover')) {
                setActive(tab);
                onSelectedTab(index + 1)
            }
        });
    };

    const setActive = (tab) => {
        const tabs = tabsRef.current;
        const bottomLine = bottomLineRef.current;
        if (!tabs || !tab) {
            return;
        }

        if (bottomLine) {
            bottomLine.style.width = `${tab.offsetWidth}px`;
            bottomLine.style.transform = `translateX(${tab.offsetLeft}px)`;
        }

        tab.style.color = activeColor;
        tab.classList.add('active');
    };

    useLayoutEffect(() => {
        const tabs = tabsRef.current;
        const firstTab = tabs.children[0];
        setActive(firstTab);
    }, []);

    return (
        <div
            ref={tabsRef}
            className={cx('wrapper', className)}
            style={{ fontSize: fontSize }}
            onMouseOver={lineTransition ? handleMouseOver : null}
            onMouseOut={lineTransition ? handleMouseOut : null}
            onClick={handleClick}
        >
            {children}
            <div
                ref={bottomLineRef}
                className={cx('bottom-line')}
                style={{ transition: lineTransition ? 'all 0.3s ease 0s' : 'none' }}
            ></div>
        </div>
    );
}

export default Tabs;
