import { FormContext } from '~/components/Form/Form';
import { useContext } from 'react';
const useForm = () => {
    const { setForm, closeForm } = useContext(FormContext);
    return { setForm, closeForm };
};

export default useForm;
