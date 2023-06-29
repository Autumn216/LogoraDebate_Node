// SESSION STORAGE
function setSessionStorageItem(key, value) {
    if(window !== 'undefined') {
        try {
            if(window.sessionStorage) {
                window.sessionStorage.setItem(key, value);
            }
        } catch(e) {
            return false;
        }
    } else {
        return false;
    }
}

function getSessionStorageItem(key) {
    if(window !== 'undefined') {
        try {
            if (window.sessionStorage) {
                return window.sessionStorage.getItem(key);
            }
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

function removeSessionStorageItem(key) {
    if(window !== 'undefined') {
        try {
            if (window.sessionStorage) {
                window.sessionStorage.removeItem(key);
            }
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

export {
    setSessionStorageItem,
    getSessionStorageItem,
    removeSessionStorageItem
};