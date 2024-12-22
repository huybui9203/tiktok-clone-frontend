import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './store/auth/AuthProvider';
import { StoreProvider } from './store';
import ConfirmDialogProvider from './contexts/ConfirmDialogProvider';
import ToastProvider from './contexts/ToastProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <GlobalStyles>
                <AuthProvider>
                    <StoreProvider>
                        <ConfirmDialogProvider>
                            <ToastProvider>
                                <App />
                            </ToastProvider>
                        </ConfirmDialogProvider>
                    </StoreProvider>
                </AuthProvider>
            </GlobalStyles>
        </BrowserRouter>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
