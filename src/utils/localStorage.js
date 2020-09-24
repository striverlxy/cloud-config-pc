const Storage = window.localStorage

const keyPrefix = 'AD_MACHINER_ADMIN_'

const keyMap = {
    ACCESS_TOKEN: keyPrefix + 'ACCESS_TOKEN',
    SIGN_UP_MOBILE: keyPrefix + 'SIGN_UP_MOBILE'
}

const setItem = (key, value) => {
    return Storage.setItem(key, value)
}

const getItem = key => {
    return Storage.getItem(key);
}

const removeItem = key => {
    return Storage.removeItem(key)
}

module.exports = {
    keyMap,
    setItem,
    getItem,
    removeItem
}