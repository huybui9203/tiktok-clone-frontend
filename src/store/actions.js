const actionTypes = {
    SHOW_FORM: 'show_form',
    HIDE_FORM: 'hide_form',
    SET_SEARCH_IS_LOADING: 'set_searc_is_loading',
    BACKUP_SIGN_UP_DATA: 'backup_sign_up_data',
}

const showForm = () => ({
    type: actionTypes.SHOW_FORM,
})

const hideForm = () => ({
    type: actionTypes.HIDE_FORM,
})

const setSearchIsLoading = (payload) => ({
    type: actionTypes.SET_SEARCH_IS_LOADING,
    payload
})

const backUpSignUpData = payload => ({
    type: actionTypes.BACKUP_SIGN_UP_DATA,
    payload
})

export { showForm, hideForm, setSearchIsLoading, backUpSignUpData }
export default actionTypes