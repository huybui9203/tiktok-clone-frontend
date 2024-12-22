import { useState, useEffect, useRef } from 'react';

function useIsVisible({ root = null, rootMargin = '0px', threshold = 1.0 }) {
    const [isVisible, setIsVisible] = useState(false);
    const targetRef = useRef(null);
    const optionsRef = useRef({
        root,
        rootMargin,
        threshold,
    });

    useEffect(() => {
        const targetEle = targetRef.current;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                setIsVisible(entry.isIntersecting);
            });
        }, optionsRef.current);

        if (targetEle) {
            observer.observe(targetEle);
        }

        return () => {
            if (targetEle) {
                observer.unobserve(targetEle);
            }
            observer.disconnect(); //Clean up the IntersectionObserver
        };
    }, []);

    return { isVisible, targetRef };
}

export default useIsVisible;
