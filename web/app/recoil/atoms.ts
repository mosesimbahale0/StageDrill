// atoms.ts
import { atom } from "recoil";

// Atom to store the funspot data
export const funspotState = atom({
  key: "funspotState",
  default: null as any, // update the type as needed
});

// Atom to store profile data
export const profileState = atom({
  key: "profileState",
  default: null as any,
});

// Similarly, create atoms for other data pieces you need:
export const sttDataState = atom({
  key: "sttDataState",
  default: null as any,
});

export const unsentSTTDataState = atom({
  key: "unsentSTTDataState",
  default: null as any,
});

export const ttsDataState = atom({
  key: "ttsDataState",
  default: null as any,
});

export const requestsState = atom({
  key: "requestsState",
  default: [] as any[],
});

export const balanceState = atom({
  key: "balanceState",
  default: null as any,
});

export const responsesState = atom({
  key: "responsesState",
  default: [] as any[],
});
