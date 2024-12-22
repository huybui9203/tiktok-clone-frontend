import { createContext, useCallback, useRef, useState } from 'react';
import Alert from '~/components/Alert';

export const ConfirmDialogContext = createContext();

function ConfirmDialogProvider({ children }) {
    const [state, setState] = useState({ isOpen: false });
    const fn = useRef();

    console.log('confirm render');

    const confirm = useCallback(
        (options = { confirmation: '', description: '', confirmBtnLabel: '', btnHorizontal: false }) => {
            return new Promise((resolve) => {
                setState({ ...options, isOpen: true });
                fn.current = (choice) => {
                    resolve(choice);
                    setState({ isOpen: false });
                };
            });
        },
    );

    return (
        <ConfirmDialogContext.Provider value={confirm}>
            {children}
            <Alert {...state} onClose={() => fn.current(false)} onConfirm={() => fn.current(true)} />
        </ConfirmDialogContext.Provider>
    );
}

export default ConfirmDialogProvider;
