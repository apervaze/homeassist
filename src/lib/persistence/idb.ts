// Minimal IndexedDB wrapper; falls back to localStorage if IDB not available

const DB_NAME = 'home-buying-assistant';
const STORE = 'kv';
const VERSION = 1;

const isBrowser = typeof window !== 'undefined';

const openDb = (): Promise<IDBDatabase | null> =>
    new Promise((resolve) => {
        if (!isBrowser || !('indexedDB' in window)) return resolve(null);
        const req = indexedDB.open(DB_NAME, VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
    });

export const idbSet = async (key: string, value: unknown): Promise<void> => {
    const db = await openDb();
    if (!db) {
        if (isBrowser) localStorage.setItem(key, JSON.stringify(value));
        return;
    }
    await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        const store = tx.objectStore(STORE);
        store.put(JSON.stringify(value), key);
    });
};

export const idbGet = async <T>(key: string): Promise<T | null> => {
    const db = await openDb();
    if (!db) {
        if (!isBrowser) return null;
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    }
    return new Promise<T | null>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        tx.onerror = () => reject(tx.error);
        const store = tx.objectStore(STORE);
        const req = store.get(key);
        req.onsuccess = () => {
            const val = req.result as string | undefined;
            resolve(val ? (JSON.parse(val) as T) : null);
        };
        req.onerror = () => resolve(null);
    });
};
