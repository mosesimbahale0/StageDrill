import redisClient from "./redis"; // Adjust the import path if needed

// Configuration variables for maintainability
const RECORDINGS_PREFIX = "STTDB:";
const TTS_PREFIX = "TTSDB:";
const DELETED_MARKER = "__deleted__";

// Helper function to build the key for STT data
function getRecordingsKey(accountId: string): string {
  return `${RECORDINGS_PREFIX}${accountId}`;
}

// Helper function to build the key for TTS data
function getTTSKey(accountId: string): string {
  return `${TTS_PREFIX}${accountId}`;
}

/**
 * Stores STT data under the given accountId.
 * The STT data should follow the schema:
 * {
 *   key: string,
 *   audioBase64: string,
 *   transcription: string,  // default is ""
 *   isSent: boolean,        // default is false
 *   timestamp: string       // typically Date.now().toString()
 * }
 *
 * @param accountId - The account identifier to store the STT data under.
 * @param sttData - The STT data object.
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function storeSTTData(
  accountId: string,
  sttData: any
): Promise<void> {
  const key = getRecordingsKey(accountId);
  await redisClient.rpush(key, JSON.stringify(sttData));
  console.log(`Stored STT data for accountId: ${accountId}`);
}

/**
 * Retrieves all STT data for the given accountId.
 *
 * @param accountId - The account identifier.
 * @returns An array of STT data objects.
 */
export async function getSTTData(accountId: string): Promise<any[]> {
  const key = getRecordingsKey(accountId);
  const sttDataList = await redisClient.lrange(key, 0, -1);
  console.log(`Retrieved STT data for accountId: ${accountId}`);
  return sttDataList.map((data: string) => JSON.parse(data));
}

/**
 * Retrieves all unsent STT data for the given accountId.
 * Unsent data is determined by the `isSent` property being false or undefined.
 *
 * @param accountId - The account identifier.
 * @returns An array of unsent STT data objects.
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function getUnsentSTTData(accountId: string): Promise<any[]> {
  // Ensure we have an array, even if getSTTData returns null/undefined.
  const allData = (await getSTTData(accountId)) || [];
  // If allData is not an array (unexpected scenario), return an empty array.
  if (!Array.isArray(allData)) {
    console.warn(
      `Expected an array from getSTTData for accountId: ${accountId}, but got a non-array value.`
    );
    return [];
  }
  const unsentData = allData.filter((entry) => !entry.isSent);
  console.log(
    `Retrieved unsent STT data for accountId: ${accountId}, count: ${unsentData.length}`
  );
  return unsentData;
}



/**
 * Updates STT data for the given accountId.
 *
 * @param accountId - The account identifier.
 * @param index - The index of the STT data in the list.
 * @param sttData - The updated STT data object.
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function updateSTTData(
  accountId: string,
  index: number,
  sttData: any
): Promise<void> {
  const redisKey = getRecordingsKey(accountId);
  // Check if the list exists
  const exists = await redisClient.exists(redisKey);
  if (!exists) {
    throw new Error(`Redis list with key "${redisKey}" does not exist.`);
  }

  // Check list length to ensure the index is valid
  const listLength = await redisClient.llen(redisKey);
  if (index < 0 || index >= listLength) {
    throw new Error(
      `Index ${index} is out of bounds. List length is ${listLength}.`
    );
  }

  await redisClient.lset(redisKey, index, JSON.stringify(sttData));
  console.log(`Updated STT data at index ${index} for accountId: ${accountId}`);
}

/**
 * Sync State With Cache (STT)
 * @param array of STT data objects
 * @param accountId
 * @returns void
 *
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function syncSTTData(
  sttData: any[],
  accountId: string
): Promise<void> {
  const key = getRecordingsKey(accountId);
  await redisClient.del(key);
  for (const data of sttData) {
    await redisClient.rpush(key, JSON.stringify(data));
  }
  console.log(`Synced STT data for accountId: ${accountId}`);
}

/**
 * Deletes STT data at the specified index from the list for the given accountId.
 * Note: Deletion is performed by setting a marker and then removing it.
 *
 * @param accountId - The account identifier.
 * @param index - The index of the STT data in the list.
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function deleteSTTData(
  accountId: string,
  index: number
): Promise<void> {
  const key = getRecordingsKey(accountId);
  await redisClient.lset(key, index, DELETED_MARKER);
  await redisClient.lrem(key, 1, DELETED_MARKER);
  console.log(`Deleted STT data at index ${index} for accountId: ${accountId}`);
}

// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Stores Synthesis Text-to-Speech (TTS) data under the given accountId.
 * The TTS data should follow the schema:
 * {
 *   key: string,
 *   text: string,
 *   audioBase64: string,
 *   isRead: boolean,       // default is false
 *   timestamp: number
 * }
 *
 * @param accountId - The account identifier to store the TTS data under.
 * @param ttsData - The TTS data object.
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function storeTTSData(
  accountId: string,
  ttsData: any
): Promise<void> {
  const key = getTTSKey(accountId);
  await redisClient.rpush(key, JSON.stringify(ttsData));
  console.log(`Stored TTS data for accountId: ${accountId}`);
}

/**
 * Retrieves all TTS data for the given accountId.
 *
 * @param accountId - The account identifier.
 * @returns An array of TTS data objects.
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function getTTSData(accountId: string): Promise<any[]> {
  const key = getTTSKey(accountId);
  const ttsData = await redisClient.lrange(key, 0, -1);
  console.log(`Retrieved TTS data for accountId: ${accountId}`);
  return ttsData.map((data: string) => JSON.parse(data));
}

/**
 * Updates TTS data for the given accountId.
 *
 * @param accountId - The account identifier.
 * @param index - The index of the TTS data in the list.
 * @param ttsData - The updated TTS data object.
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function updateTTSData(
  accountId: string,
  index: number,
  ttsData: any
): Promise<void> {
  const key = getTTSKey(accountId);
  await redisClient.lset(key, index, JSON.stringify(ttsData));
  console.log(`Updated TTS data at index ${index} for accountId: ${accountId}`);
}

/**
 * Deletes TTS data at the specified index from the list for the given accountId.
 *
 * @param accountId - The account identifier.
 * @param index - The index of the TTS data in the list.
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function deleteTTSData(
  accountId: string,
  index: number
): Promise<void> {
  const key = getTTSKey(accountId);
  await redisClient.lset(key, index, DELETED_MARKER);
  await redisClient.lrem(key, 1, DELETED_MARKER);
  console.log(`Deleted TTS data at index ${index} for accountId: ${accountId}`);
}




/**
 * Sync State With Cache (TTS)
 * @param array of TTS data objects
 * @param accountId
 * @returns void
 *
 */
// ────────────────────────────────────────────────────────────────────────────────
export async function syncTTSData(
  ttsData: any[],
  accountId: string
): Promise<void> {
  const key = getTTSKey(accountId);
  await redisClient.del(key);
  for (const data of ttsData) {
    await redisClient.rpush(key, JSON.stringify(data));
  }
  console.log(`Synced TTS data for accountId: ${accountId}`);
}



