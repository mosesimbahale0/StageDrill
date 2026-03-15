export interface Template {
  _id: string;
  name: string;
  // ... other properties of your Template ...
}

export interface SemanticSearchResponse {
  query: string;
  ids: string[];
}

export interface CleanResponse {
  _character_index: number;
  text: string;
}



// export interface CleanResponseData {
//   candidates: any;
//   clean_responses: CleanResponse[];
// }

export interface CleanResponseData {
  candidates: CleanResponse[]; // Update to candidates
}

// Define the response type globally at the top of the file
export interface FastAPIResponse {
  responses: {
    character_index: number;
    text: string;
  }[]; // Assuming this is the structure of your FastAPI response
}