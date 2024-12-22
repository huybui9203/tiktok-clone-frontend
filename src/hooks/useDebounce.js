import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
    
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [cancel, setCancel] = useState(false)

    useEffect(() => {
        if(cancel) {
            return
        }
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(handler)
    }, [value, cancel]);
    return [debouncedValue, setCancel, cancel];
}

export default useDebounce;
