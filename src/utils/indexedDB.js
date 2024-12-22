const dbName = 'tiktok-media-upload';
let request;
let db;
let version = 1;
const VIDEO_STORE = 'videos';

const isSupportedIndexDB = () => {
    const idb =
        window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

    if (!idb) {
        console.log("This browser doesn't support IndexedDB");
        return false;
    }
    return true;
};
const init = () => {
    return new Promise((resolve, reject) => {
        if (!isSupportedIndexDB()) {
            reject('IndexedDB not supported by the browser');
        }
        request = indexedDB.open(dbName);
        request.onupgradeneeded = (e) => {
            db = e.target.result;
            // if the data object store doesn't exist, create it
            if (!db.objectStoreNames.contains(VIDEO_STORE)) {
                db.createObjectStore(VIDEO_STORE, { keyPath: 'id' });
            }
        };
        request.onsuccess = (e) => {
            db = e.target.result;
            version = db.version;
            resolve('connection success!');
        };
        request.onerror = () => {
            reject('connection error!');
        };
    });
};

const close = () => {
    if (db) {
        db.close();
    }
};

const addData = (storeName, data) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('connection error');
            return;
        }
        const request = db.transaction(storeName, 'readwrite').objectStore(storeName).add(data);

        request.onsuccess = (e) => {
            resolve(data);
        };

        request.onerror = () => {
            const error = request.error?.message;
            if (error) {
                reject(error);
            } else {
                reject('Unknown error');
            }
        };
    });
};

const getStoreData = (storeName) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('connection error');
            return;
        }
        const request = db.transaction(storeName, 'readonly').objectStore(storeName).getAll();
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            const error = request.error?.message;
            if (error) {
                reject(error);
            } else {
                reject('Unknown error');
            }
        };
    });
};

const deleteData = (storeName, key) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('connection error');
            return;
        }

        const request = db.transaction(storeName, 'readwrite').objectStore(storeName).delete(key);
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            const error = request.error?.message;
            if (error) {
                reject(error);
            } else {
                reject('Unknown error');
            }
        };
    });
};

const updateData = (storeName, newData, key) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('connection error');
            return;
        }
        const request = db.transaction(storeName, 'readwrite').objectStore(storeName).put(newData);
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            const error = request.error?.message;
            if (error) {
                reject(error);
            } else {
                reject('Unknown error');
            }
        };
    });
};

const clearStore = (storeName) => {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject('connection error');
            return;
        }

        const request = db.transaction(storeName, 'readwrite').objectStore(storeName).clear();
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            const error = request.error?.message;
            if (error) {
                reject(error);
            } else {
                reject('Unknown error');
            }
        };
    });
};

const checkIfStoreHasData = (storeName) => {
    return new Promise((resolve, reject) => {
        const request = db.transaction(storeName, 'readonly').objectStore(storeName).count();
        request.onsuccess = () => {
            const count = request.result;
            if (count > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        };
        request.onerror = () => {
            const error = request.error?.message;
            if (error) {
                reject(error);
            } else {
                reject('Unknown error');
            }
        };
    });
};

export { init, close, addData, getStoreData, deleteData, updateData, clearStore, checkIfStoreHasData, VIDEO_STORE };
