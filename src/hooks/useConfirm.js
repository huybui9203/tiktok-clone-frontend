import { useContext } from "react";
import { ConfirmDialogContext } from "~/contexts/ConfirmDialogProvider";

function useConfirm() {
    const confirm = useContext(ConfirmDialogContext)
    return confirm
}

export default useConfirm