import { Link, Outlet } from 'react-router-dom';
import Alert from '~/components/Alert';
import Button from '~/components/Button';
import FormGroup from '~/components/FormGroup';
import Select from '~/components/Select';
import { useConfirm } from '~/hooks';
function Following() {
    const confirm = useConfirm();
    return (
        <div>
            <div>
                <span style={{ color: '#0be09b', fontSize: '1.2rem' }}>Letters, numbers and special characters</span>
            </div>
            <button
                onClick={async () => {
                    const res = await confirm({
                        confirmation: 'Are you sure you want to delete this comment?',
                        confirmBtnLabel: 'Delete',
                    })
                    console.log(res)
                    if(res){
                        console.log('delete')
                    } else {
                        console.log('cancel')
                    }
                }}
            >
                show dialog
            </button>
        </div>
    );
}

export default Following;
