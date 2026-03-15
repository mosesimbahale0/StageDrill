import { openDB, IDBPDatabase } from "idb";

// Define the structure of the database
interface Recording {
  id?: number; // `id` must remain optional to allow auto-incrementing.
  audioBase64: string;
  isChecked: boolean;
  isArchived: boolean;
  isSent: boolean;
  isSpeech: string;
  transcription: string;
  timestamp: string;
}

type DatabaseSchema = {
  Recordings: {
    key: number; // Explicitly set the key type to `number`.
    value: Recording;
  };
};

// Initialize or open the IndexedDB
export const initMicDB = async (): Promise<IDBPDatabase<DatabaseSchema>> => {
  return openDB<DatabaseSchema>("MicDatabase", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("Recordings")) {
        // Create an object store with 'id' as the keyPath and auto-incrementing keys
        db.createObjectStore("Recordings", { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// Save a new Recording to IndexedDB
export const saveToMicDB = async (
  data: Omit<Recording, "id">
): Promise<number> => {
  try {
    const db = await initMicDB();
    const tx = db.transaction("Recordings", "readwrite");
    const store = tx.objectStore("Recordings");
    const result = await store.add(data);
    await tx.done;
    return result;
  } catch (error) {
    console.error("Error saving to MicDB:", error);
    throw error;
  }
};

// Get all Recordings from IndexedDB
export const getAllFromMicDB = async (): Promise<Recording[]> => {
  try {
    const db = await initMicDB();
    return await db.getAll("Recordings");
  } catch (error) {
    console.error("Error fetching all Recordings from MicDB:", error);
    throw error;
  }
};

// Update a Recording in IndexedDB
export const updateMicDB = async (
  id: number,
  updates: Partial<Omit<Recording, "id">>
): Promise<void> => {
  try {
    const db = await initMicDB();
    const existingRecording = await db.get("Recordings", id);
    if (!existingRecording) {
      throw new Error(`Recording with ID ${id} not found`);
    }
    await db.put("Recordings", { ...existingRecording, ...updates });
  } catch (error) {
    console.error(`Error updating Recording with ID ${id}:`, error);
    throw error;
  }
};

// Delete a Recording from IndexedDB
export const deleteFromMicDB = async (id: number): Promise<void> => {
  try {
    const db = await initMicDB();
    await db.delete("Recordings", id);
  } catch (error) {
    console.error(`Error deleting Recording with ID ${id}:`, error);
    throw error;
  }
};



// Get a single Recording by ID from IndexedDB
export const getFromMicDB = async (id: number): Promise<Recording | undefined> => {
  try {
    const db = await initMicDB();
    return await db.get("Recordings", id);
  } catch (error) {
    console.error(`Error fetching Recording with ID ${id}:`, error);
    throw error;
  }
};

//  Clear Mic db as we start new session
export const clearMicDB = async (): Promise<void> => {
  try {
    const db = await initMicDB();
    const tx = db.transaction("Recordings", "readwrite");
    const store = tx.objectStore("Recordings");
    await store.clear();
    await tx.done;
  } catch (error) {
    console.error("Error clearing MicDB:", error);
    throw error;
  }
};

