import { createContext, useCallback, useMemo, useState } from 'react';
import { ToastsContainer } from '~/components/Toast';

export const ToastContext = createContext();

function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const show = useCallback((message) => {
        return new Promise(resolve => {
            setToasts((toasts) => {
                const id = Math.floor(Math.random() * 10000)
                return [...toasts, { id , message }]
            });
            setTimeout(() => {
                resolve(true)
            }, 2200)
        })
    });

    const remove = useCallback((id) => {
        setToasts(toasts => {
            const newToasts = toasts.filter(toast => toast.id !== id)
            return newToasts
        })
    })

    const contextValue = useMemo(() => ({show, remove}))
    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastsContainer toasts={toasts} />
        </ToastContext.Provider>
    );
}

export default ToastProvider;

