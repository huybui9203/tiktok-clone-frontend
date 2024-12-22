import { createContext, useMemo, useReducer } from 'react';
import reducer, { initState } from './reducer';

const StoreContext = createContext();

function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, initState);
    const store = useMemo(() => [state, dispatch], [state]);
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export { StoreContext };
export default Provider;
