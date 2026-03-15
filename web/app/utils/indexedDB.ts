import { openDB, IDBPDatabase } from "idb";

// Define the structure of stored audio data
interface AudioResponse {
    key: string;
    text: string;
    base64: string;
    isRead: boolean;
}

// Initialize or open the IndexedDB
export const initDB = async (): Promise<IDBPDatabase> => {
    return openDB("TTSDatabase", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("audioResponses")) {
                db.createObjectStore("audioResponses", { keyPath: "key" });
            }
        },
    });
};

// Save an audio response to IndexedDB
export const saveToDB = async (key: string, data: AudioResponse): Promise<void> => {
    const db = await initDB();
    await db.put("audioResponses", { ...data, key });
};

// Get all audio responses from IndexedDB
export const getAllFromDB = async (): Promise<AudioResponse[]> => {
    const db = await initDB();
    return await db.getAll("audioResponses");
};

// Delete read audio responses from IndexedDB
export const deleteReadFromDB = async (): Promise<void> => {
    const db = await initDB();
    const tx = db.transaction("audioResponses", "readwrite");
    const store = tx.objectStore("audioResponses");
    const allKeys = await store.getAllKeys();
    for (const key of allKeys) {
        const record = await store.get(key);
        if (record.isRead) {
            await store.delete(key);
        }
    }
    await tx.done;
};




// Clear all audio responses from IndexedDB
export const clearDB = async (): Promise<void> => {
    const db = await initDB();
    await db.clear("audioResponses");
};