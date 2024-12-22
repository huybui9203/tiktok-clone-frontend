import { useContext } from 'react';
import { StoreContext } from '~/store';

function useStore() {
    const [store, dispatch] = useContext(StoreContext);
    return { store, dispatch };
}

export default useStore;
