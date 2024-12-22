const convertBytesToMegaBytes = (size) => {
    if(size === undefined || size === null) {
        return
    }
    const MB = 1024 * 1024
    return size === 0 ? 0 : (size / MB).toFixed(2)
}

export default convertBytesToMegaBytes