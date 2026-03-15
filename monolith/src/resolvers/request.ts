// src/resolvers/client.ts
import Request from "../models/request.model.js";
import Funspot from "../models/funspot.model.js";
import Customer from "../models/customer.model.js";
import Languages from "../models/language.model.js";
import Response from "../models/response.model.js";
import Cleanresponse from "../models/cleanResponse.model.js";
import Avatars from "../models/avatar.model.js";
import Funds from "../models/funds.model.js";

import { FastAPIResponse } from "../types/graphql.js";

import { pubsub } from "../utils/redisDb.js";
import colors from "colors";
// import { OpenAI } from "openai";

import EventSource from "eventsource"; // Import EventSource for Node.js



export const requestResolvers = {
  Query: {
    getRequestById: async (
      _: any,
      { _request_id }: { _request_id: string }
    ) => {
      try {
        const request = await Request.findById(_request_id);
        if (!request) {
          throw new Error("Request not found"); // Handle not found case
        }
        return request;
      } catch (error) {
        console.error(error); // Log the error for debugging
        throw new Error("Error fetching request"); // Generic error for client
      }
    },

    getAllRequestsByFunspotId: async (_: any, { funspotId }: any) => {
      try {
        const requests = await Request.find({ _funspot_id: funspotId });
        return requests;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    /*****************************************************************************
     *  PSEUDOCODE FOR MULTIPERSONA CHAT
     *
     * Steps
     *
     * 1. Get data: Obtain all necessary information from the caller.
     * 2. Organize data: Structure the data into a suitable format.
     * 3. Generate template context and examples.
     * 4. Populate templates: Fill the templates with specific data.
     * 5. Initialize character count: Determine the number of characters to process.
     *
     * 6. Process single character:
     *    - If there's only one character:
     *       a. Query the model with the populated templates.
     *       b. Clean the result: Call the FastAPI cleaner.
     *       c. Store the result.
     *       d. Return the result immediately.
     *
     * 7. Process multiple characters:
     *    - If there are multiple characters:
     *       a. Iterate over each character:
     *           i. Query the model for the current character.
     *           ii. Clean the result asynchronously.
     *           iii. Store the result asynchronously.
     *           iv. Return the result for the current character immediately.
     *           v. Update the template context and prompt for the next character.
     *******************************************************************************/

    // createRequest: async (_: any, { input }: { input: any }) => {
    //   try {
    //     // Step 1: Get data from the caller
    //     if (!input._funspot_id || !input.text) {
    //       throw new Error("Funspot ID and text are required");
    //     }

    //     const funspot = await Funspot.findById(input._funspot_id);
    //     if (!funspot) {
    //       throw new Error("Funspot not found");
    //     }

    //     const {
    //       context,
    //       examples,
    //       characters,
    //       summary: funspotSummary,
    //     } = funspot;

    //     // Get language from language_id in character

    //     const customer = await Customer.findOne({
    //       _id: funspot._account_Id,
    //     });
    //     if (!customer) {
    //       throw new Error("Customer not found");
    //     }

    //     const user = {
    //       name: customer.name,
    //       location: customer.location,
    //       profession: customer.profession,
    //       sex: customer.sex,
    //       bday: customer.bday,
    //     };

    //     console.log("User:", user);

    //     // Create a new request record
    //     const request = await Request.create(input);
    //     pubsub.publish("REQUEST_CREATED", { requestCreated: input });

    //     const openai = new OpenAI({
    //       apiKey: process.env.NVIDIA_API_KEY,
    //       baseURL: "https://integrate.api.nvidia.com/v1",
    //     });

    //     // Step 7: Process multiple characters
    //     const processCharacters = async () => {
    //       let previousResponses = "";

    //       for (let i = 0; i < characters.length; i++) {
    //         const character = characters[i];

    //         // Inside your resolvers, where you're generating the context:
    //         const language = await Languages.findById(
    //           character._language_id
    //         );

    //         const currentContext = `

    //               You are ${character.character_name}, a character in an ongoing conversation. You play the role of ${character.character_role}. Below is the conversation so far, with the most recent user input at the end:

    //               ${previousResponses}

    //               User has just said: "${input.text}".

    //               As ${character.character_name},respond according to the following guidelines:

    //               1. **Engage with the Conversation**: Only respond if you have something relevant or meaningful to contribute based on your role as ${character.character_role}. Consider the entire conversation context, your character's personality, and how your response could move the conversation forward.

    //               2. **Agreement or Acknowledgment**: If you don't have a substantial response or if the conversation doesn't directly involve you, acknowledge what has been said or express agreement using a neutral or supportive phrase. You can say something like "I agree with that." or "That makes sense." If your character wouldn't respond in this situation, use   **${character.character_name}**: [PASS ].  to indicate you are listening but have no input.

    //               3. **Stay in Character**: Your response should be consistent with your character's role and personality. Avoid providing information or responses that are out of character.

    //               4. **Response Format**: Always format your response as follows: ${character.character_name}: [Your response here]. Ensure your response is well-structured, and if you're agreeing or not contributing, use a simple acknowledgment.

    //               5. **Consider the Group Dynamic**: Be mindful of how your response will be received by other personas in the conversation. Maintain the tone and flow of the discussion.

    //               6. **Provide response in the language of the persona**: ${language.name}.

    //               IMPORTANT: Do not stray from your role as ${character.character_name}. If there is nothing meaningful to add, simply respond with "PASS."

    //               IMPORTANT: Do not include the role or anything else apart from the guidence below

    //               Example Response:
    //               **${character.character_name}**: [Your response here].
    //               `;

    //         // ... (rest of your code)

    //         const prompt = `
    //               ${currentContext}
    //               ${context}
    //               ${examples
    //                 .map((example) =>
    //                   example.InputOutputTextPair.map(
    //                     (sample) =>
    //                       `\n**${sample.input_text}**\n${sample.output_text}`
    //                   ).join("\n")
    //                 )
    //                 .join("\n")}
    //               **Emotion:** ${input.emotion}
    //               **User:** ${user.name} is a ${user.profession} from ${
    //           user.location
    //         }.
    //               **Funspot Summary:** ${funspotSummary}
    //             `;

    //         console.log("Prompt:---------->", prompt);

    //         const completion = await openai.chat.completions.create({
    //           model: "google/gemma-7b",
    //           messages: [{ role: "user", content: prompt }],
    //           temperature: 0.5,
    //           top_p: 1,
    //           max_tokens: 1024,
    //           stream: false,
    //         });

    //         const responseContent = completion.choices
    //           .map((choice) => choice.message.content)
    //           .join("\n");

    //         //console
    //         console.log(
    //           colors.bgMagenta("🚀  Response Content: " + responseContent)
    //         );

    //         //TODO add loop -- do not concatenate unclean response call the cleaner with each chunk
    //         // Step 6: Store and return the result immediately
    //         const response = {
    //           _request_id: request._id,
    //           _account_id: input._account_id,
    //           _funspot_id: input._funspot_id,
    //           _index: i,
    //           text: responseContent.trim(),
    //           emotion: input.emotion,
    //           is_read: false,
    //         };

    //         const savedResponse = await Response.create(response);
    //         pubsub.publish("RESPONSE_CREATED", {
    //           responseCreated: savedResponse,
    //         });

    //         console.log(
    //           "Success: Response created for character:",
    //           character.character_name
    //         );

    //         // ... (rest of your code)

    //         (async () => {
    //           try {
    //             const cleanResponse = await fetch(
    //               "http://0.0.0.0:8000/lounge",
    //               {
    //                 method: "POST",
    //                 headers: {
    //                   Accept: "application/json",
    //                   "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                   responses: [response],
    //                   personas: characters,
    //                 }),
    //               }
    //             );

    //             // Check for a failed response from the server
    //             if (!cleanResponse.ok) {
    //               console.error("Failed to fetch:", cleanResponse.statusText);
    //               throw new Error("Error fetching clean response");
    //             }

    //             const rawResponseText = await cleanResponse.text();
    //             console.log(
    //               "Response Text FROM API 8000/LOUNGE:",
    //               rawResponseText
    //             );

    //             try {
    //               const cleanResponseData = JSON.parse(rawResponseText);

    //               // Access the candidates array from the clean response object
    //               if (
    //                 cleanResponseData &&
    //                 cleanResponseData.candidates &&
    //                 cleanResponseData.candidates.length > 0
    //               ) {
    //                 const cleanResponseObject = cleanResponseData.candidates[0];
    //                 // ... (use cleanResponseObject)
    //                 // log the clean response
    //                 console.log(
    //                   "Clean Response: ->>>>>>-------------------->",
    //                   cleanResponseObject
    //                 );

    //                 const savedCleanResponse = await Cleanresponse.create({
    //                   _request_id: request._id,
    //                   _account_id: input._account_id,
    //                   _funspot_id: input._funspot_id,
    //                   _character_index: cleanResponseObject._character_index,
    //                   text: cleanResponseObject.text,
    //                   emotion: input.emotion,
    //                   is_read: false,
    //                 });

    //                 // type Cleanresponse {
    //                 //   _id: ID!
    //                 //   _request_id: String!
    //                 //   _account_id: String!
    //                 //   _funspot_id: String!
    //                 //   _character_index: Int!
    //                 //   text:String
    //                 //   emotion:String
    //                 //   is_read: Boolean
    //                 //   }

    //                 // pubsub.publish("RESPONSE_CREATED", { responseCreated: savedResponse });

    //                 pubsub.publish("CLEANRESPONSE_CREATED", {
    //                   cleanresponseCreated: savedCleanResponse,
    //                 });
    //               } else {
    //                 console.error(
    //                   "No clean responses found in the API response."
    //                 );
    //               }
    //             } catch (error) {
    //               console.error("Error parsing API response:", error);
    //               // Handle the error gracefully (e.g., display an error message to the user)
    //             }
    //           } catch (error) {
    //             console.error("Error fetching clean response:", error);
    //             // Handle the error gracefully (e.g., display an error message to the user)
    //           }
    //         })();

    //         // ... (rest of your code)

    //         // Update previous responses for the next character's context
    //         previousResponses += `\n${
    //           character.character_name
    //         }: ${responseContent.trim()}`;
    //       }
    //     };

    //     await processCharacters();

    //     return request;
    //   } catch (error) {
    //     console.error("Error creating request:", error);
    //     throw new Error("Error creating request");
    //   }
    // },

    // mediateRequest: async (_: any, { input }: { input: any }) => {
    //   try {
    //     // Step 1: Validate input
    //     if (!input._funspot_id || !input.text) {
    //       throw new Error("Funspot ID and text are required");
    //     }

    //     // Get the funspot with characters
    //     const funspot = await Funspot.findById(input._funspot_id);
    //     if (!funspot) {
    //       throw new Error("Funspot not found");
    //     }

    //     const { context, summary: funspotSummary, characters } = funspot;

    //     if (!characters.length) {
    //       throw new Error("No characters found in this funspot");
    //     }

    //     // Get the customer
    //     const customer = await Customer.findOne({
    //       _id: funspot._account_Id,
    //     });
    //     if (!customer) {
    //       throw new Error("Customer not found");
    //     }

    //     // Prepare the user object
    //     const user = {
    //       name: customer.name,
    //       location: customer.location,
    //       profession: customer.profession,
    //       sex: customer.sex,
    //       bday: customer.bday,
    //     };

    //     // log the user
    //     console.log(colors.bgBlue("🚀  User: " + JSON.stringify(user)));

    //     // History = latest 5 requests and their responses in this funspot
    //     // Step 1 get 5 requests efficiently by funspotid
    //     const requestsHistory = await Request.find({
    //       _funspot_id: input._funspot_id,
    //     })
    //       .sort({ createdAt: -1 })
    //       .limit(5);
    //     // Step 2 get the responses for each request
    //     const responsesHistory = await Promise.all(
    //       requestsHistory.map(async (request) => {
    //         const responses = await Cleanresponse.find({
    //           _request_id: request._id,
    //         });
    //         return responses;
    //       })
    //     );
    //     // Step 3 combine requests and responses into a single array
    //     const history = requestsHistory.map((request, index) => ({
    //       request,
    //       responses: responsesHistory[index],
    //     }));

    //     // log the history
    //     console.log(colors.bgBlue("🚀  History: " + JSON.stringify(history)));

    //     // Step 2: Fetch avatars and languages for each character in the funspot
    //     const charactersWithDetails = await Promise.all(
    //       characters.map(async (character) => {
    //         const avatar = await Avatars.findById(character._avatar_id);
    //         const avatarDetails = avatar
    //           ? {
    //               name: avatar.name,
    //               photo: avatar.photo,
    //               voiceType: avatar.voice_type,
    //               voiceName: avatar.voice_name,
    //               ssmlGender: avatar.SSML_gender,
    //             }
    //           : {
    //               name: "Unknown Avatar",
    //               photo: null,
    //               voiceType: "Unknown",
    //               voiceName: "Unknown",
    //               ssmlGender: "Unknown",
    //             };

    //         const language = await Languages.findById(character._language_id);
    //         const languageDetails = language
    //           ? {
    //               name: language.name,
    //               code: language.language_code,
    //             }
    //           : {
    //               name: "Unknown Language",
    //               code: "unknown",
    //             };

    //         return {
    //           characterName: character.character_name,
    //           characterRole: character.character_role,
    //           avatar: avatarDetails,
    //           language: languageDetails,
    //         };
    //       })
    //     );

    //     // Step 3: Create a new request record
    //     const request = await Request.create(input);
    //     pubsub.publish("REQUEST_CREATED", { requestCreated: input });

    //     const prompt = `${input.text}\n**Emotion:** ${input.emotion}`;

    //     // Additional instructions and context data
    //     const instructions = `
    //         This is the user's information...
    //         1. User Information:
    //         - Name: ${user.name}
    //         - Profession: ${user.profession || "Not provided"}
    //         - Sex: ${user.sex}
    //         - Birthday: ${user.bday || "Not provided"}
    //         - Location: ${user.location || "Not provided"}
    //         You can use the above to refer to the user by name etc,,,
    
    //         2. Funspot Summary: ${funspotSummary}
    
    //         3. The context of this  Conversation: "${context}"
    
    //         4. Personas Available:
    //         ${charactersWithDetails
    //           .map(
    //             (persona, index) =>
    //               `   - Persona ${index + 1}:
    //          Name: ${persona.characterName}
    //          Role: ${persona.characterRole}
    //          Language: ${persona.language.name}`
    //           )
    //           .join("\n")}
    
    //         This is the history of the coversation
    //         ${history
    //           .map(
    //             (item, index) =>
    //               `\nConversation ${index + 1}:
    //             ${item.request.text}
    //             ${item.responses
    //               .map((response) => `${response.text}`)
    //               .join("\n")}`
    //           )
    //           .join("\n")}
    
    //         5. The user has just said: "${input.text}"
    
    //         6. The user's emotion is: "${input.emotion}"
    
    //         Based on the user's input "${
    //           input.text
    //         }" and the context provided, generate a response using the most relevant personas.
    //         `;

    //     // Log all the data being sent
    //     console.log(colors.bgBlue("🚀  Data sent to FastAPI:"));
    //     console.log(colors.bgBlue("------------------------------------"));
    //     console.log(colors.bgBlue("Human Message: " + prompt));
    //     console.log(colors.bgBlue("Context: " + JSON.stringify(context)));
    //     console.log(
    //       colors.bgBlue("Personas: " + JSON.stringify(charactersWithDetails))
    //     );
    //     console.log(colors.bgBlue("User: " + JSON.stringify(user)));
    //     console.log(colors.bgBlue("Funspot Summary: " + funspotSummary));
    //     console.log(colors.bgBlue("Instructions: " + instructions));
    //     console.log(colors.bgBlue("------------------------------------"));

    //     // Serialize personas as a JSON string and URL-encode it
    //     const personasJson = JSON.stringify(charactersWithDetails);
    //     const encodedPersonas = encodeURIComponent(personasJson);
    //     const encodedPrompt = encodeURIComponent(prompt);
    //     const encodedContext = encodeURIComponent(instructions); // Updated to include the new context

    //     // Send the data to FastAPI backend (using your preferred method)

    //     // Construct the URL with query parameters
    //     const url = `http://0.0.0.0:8001/chat-stream?human_message=${encodedPrompt}&personas=${encodedPersonas}&context=${encodedContext}`;

    //     const eventSource = new EventSource(url);

    //     // Initialize a counter for character responses
    //     let responseCount = 0;
    //     const totalCharacters = characters.length;

    //     eventSource.onmessage = async (event) => {
    //       try {
    //         const response = JSON.parse(event.data);
    //         console.log(
    //           "✅ Received response from character:",
    //           response.character_index
    //         );

    //         // Validate and store the response
    //         if (
    //           response &&
    //           response.character_index !== undefined &&
    //           response.text
    //         ) {
    //           const cleanResponse = await Cleanresponse.create({
    //             _request_id: request._id,
    //             _account_id: input._account_id,
    //             _funspot_id: input._funspot_id,
    //             _character_index: response.character_index,
    //             text: response.text,
    //             emotion: input.emotion,
    //             is_read: false,
    //           });

    //           console.log(
    //             "✅ Response successfully stored in the database:",
    //             response.text
    //           );

    //           // // Deduct 1 token from the user's funds
    //           // try {
    //           //   const fund = await Funds.findOneAndUpdate(
    //           //     { _account_id: input._account_id },
    //           //     { $inc: { tokens: -1 } }, // Decrement tokens by 1
    //           //     { new: true } // Return the updated document
    //           //   );

    //           //   if (!fund) {
    //           //     console.error("Fund not found for user:", input._account_id);
    //           //     // Handle the case where the fund is not found, maybe throw an error or log it
    //           //   } else {
    //           //     console.log("💰💰💰Tokens deducted successfully. Remaining tokens:", fund.tokens);
    //           //   }
    //           // } catch (error) {
    //           //   console.error("Error deducting tokens:", error);
    //           //   // Handle the error appropriately, maybe revert the response creation
    //           // }

    //           // Deduct 1 token from the user's funds
    //           try {
    //             const existingFund = await Funds.findOne({
    //               _account_id: input._account_id,
    //             });

    //             if (!existingFund) {
    //               console.error("Fund not found for user:", input._account_id);
    //               // Handle the case where the fund is not found, maybe throw an error or log it
    //             } else {
    //               const updatedFund = await Funds.findOneAndUpdate(
    //                 { _account_id: input._account_id },
    //                 {
    //                   tokens: (() => {
    //                     const currentTokens = parseFloat(existingFund.tokens);
    //                     if (isNaN(currentTokens)) {
    //                       console.error(
    //                         "Invalid existing tokens value:",
    //                         existingFund.tokens
    //                       );
    //                       return existingFund.tokens; // Or handle the error differently
    //                     }
    //                     return (currentTokens - 1).toString(); // Deduct 1 token
    //                   })(),
    //                 },
    //                 { new: true } // Return the updated document
    //               );

    //               if (updatedFund) {
    //                 console.log(
    //                   "💰💰💰Tokens deducted successfully. Remaining tokens:",
    //                   updatedFund.tokens
    //                 );
    //               } else {
    //                 console.error(
    //                   "Failed to update fund after deducting tokens."
    //                 );
    //               }
    //             }
    //           } catch (error) {
    //             console.error("Error deducting tokens:", error);
    //             // Handle the error appropriately, maybe revert the response creation
    //           }

    //           // // Step 6: Publish each response after storing it
    //           // pubsub.publish("RESPONSE_CREATED", {
    //           //   responseCreated: cleanResponse,
    //           // });
    //           //clean response subscription
    //           // cleanresponseCreated: {
    //           //   subscribe: () => pubsub.asyncIterator(["CLEANRESPONSE_CREATED"]),
    //           // },

    //           // Step 6: Publish each response after storing it
    //           pubsub.publish("CLEANRESPONSE_CREATED", {
    //             cleanresponseCreated: cleanResponse,
    //           });

    //           // Increment the response count
    //           responseCount++;

    //           // If all characters have responded, close the SSE connection
    //           if (responseCount === totalCharacters) {
    //             console.log(
    //               "✅ All characters have responded. Closing SSE connection."
    //             );
    //             eventSource.close(); // Close the connection once all responses are received
    //           }
    //         } else {
    //           console.error("Unexpected response format:", response);
    //         }
    //       } catch (error) {
    //         console.error("Error processing SSE response:", error);
    //       }
    //     };

    //     // Step 7: Handle errors from the SSE connection
    //     eventSource.onerror = (error) => {
    //       console.error("Error in SSE connection:", error);
    //       eventSource.close(); // Close the connection on error to avoid infinite loop
    //     };

    //     // Step 8: Close the SSE connection when the server sends a close event
    //     eventSource.close = () => {
    //       console.log("SSE connection closed.");
    //     };

    //     return request;
    //   } catch (error) {
    //     console.error("Error creating request:", error);
    //     throw new Error("Error creating request");
    //   }
    // },















    mediateRequest: async (_: any, { input }: { input: any }) => {
      try {
        // Step 1: Validate input
        if (!input._funspot_id || !input.text) {
          throw new Error("Funspot ID and text are required");
        }

        // Get the funspot with characters
        const funspot = await Funspot.findById(input._funspot_id);
        if (!funspot) {
          throw new Error("Funspot not found");
        }

        const { context, summary: funspotSummary, characters } = funspot;

        if (!characters.length) {
          throw new Error("No characters found in this funspot");
        }

        // Get the customer
        const customer = await Customer.findOne({
          _id: funspot._account_Id,
        });
        if (!customer) {
          throw new Error("Customer not found");
        }

        // Prepare the user object
        const user = {
          name: customer.name,
          location: customer.location,
          profession: customer.profession,
          sex: customer.sex,
          bday: customer.bday,
        };

        // log the user
        console.log(colors.bgBlue("🚀  User: " + JSON.stringify(user)));

        // History = latest 5 requests and their responses in this funspot
        // Step 1 get 5 requests efficiently by funspotid
        const requestsHistory = await Request.find({
          _funspot_id: input._funspot_id,
        })
          .sort({ createdAt: -1 })
          .limit(5);
        // Step 2 get the responses for each request
        const responsesHistory = await Promise.all(
          requestsHistory.map(async (request) => {
            const responses = await Cleanresponse.find({
              _request_id: request._id,
            });
            return responses;
          })
        );
        // Step 3 combine requests and responses into a single array
        const history = requestsHistory.map((request, index) => ({
          request,
          responses: responsesHistory[index],
        }));

        // log the history
        console.log(colors.bgBlue("🚀  History: " + JSON.stringify(history)));

        // Step 2: Fetch avatars and languages for each character in the funspot
        const charactersWithDetails = await Promise.all(
          characters.map(async (character) => {
            const avatar = await Avatars.findById(character._avatar_id);
            const avatarDetails = avatar
              ? {
                  name: avatar.name,
                  photo: avatar.photo,
                  voiceType: avatar.voice_type,
                  voiceName: avatar.voice_name,
                  ssmlGender: avatar.SSML_gender,
                }
              : {
                  name: "Unknown Avatar",
                  photo: null,
                  voiceType: "Unknown",
                  voiceName: "Unknown",
                  ssmlGender: "Unknown",
                };

            const language = await Languages.findById(
              character._language_id
            );
            const languageDetails = language
              ? {
                  name: language.name,
                  code: language.language_code,
                }
              : {
                  name: "Unknown Language",
                  code: "unknown",
                };

            return {
              characterName: character.character_name,
              characterRole: character.character_role,
              avatar: avatarDetails,
              language: languageDetails,
            };
          })
        );

        // Step 3: Create a new request record
        const request = await Request.create(input);
        pubsub.publish("REQUEST_CREATED", { requestCreated: input });

        const prompt = `${input.text}\n**Emotion:** ${input.emotion}`;

        // Additional instructions and context data
        const instructions = `
        This is the user's information...
        1. User Information:
        - Name: ${user.name}
        - Profession: ${user.profession || "Not provided"}
        - Sex: ${user.sex}
        - Birthday: ${user.bday || "Not provided"}
        - Location: ${user.location || "Not provided"}
        You can use the above to refer to the user by name etc,,,

        2. Funspot Summary: ${funspotSummary}

        3. The context of this  Conversation: "${context}"

        4. Personas Available:
        ${charactersWithDetails
          .map(
            (persona, index) =>
              `   - Persona ${index + 1}:
         Name: ${persona.characterName}
         Role: ${persona.characterRole}
         Language: ${persona.language.name}`
          )
          .join("\n")}

        This is the history of the coversation
        ${history
          .map(
            (item, index) =>
              `\nConversation ${index + 1}:
            ${item.request.text}
            ${item.responses.map((response) => `${response.text}`).join("\n")}`
          )
          .join("\n")}

        5. The user has just said: "${input.text}"

        6. The user's emotion is: "${input.emotion}"

        Based on the user's input "${
          input.text
        }" and the context provided, generate a response using the most relevant personas.
        `;

        // Log all the data being sent
        console.log(colors.bgBlue("🚀  Data sent to FastAPI:"));
        console.log(colors.bgBlue("------------------------------------"));
        console.log(colors.bgBlue("Human Message: " + prompt));
        console.log(colors.bgBlue("Context: " + JSON.stringify(context)));
        console.log(
          colors.bgBlue("Personas: " + JSON.stringify(charactersWithDetails))
        );
        console.log(colors.bgBlue("User: " + JSON.stringify(user)));
        console.log(colors.bgBlue("Funspot Summary: " + funspotSummary));
        console.log(colors.bgBlue("Instructions: " + instructions));
        console.log(colors.bgBlue("------------------------------------"));

        // Serialize personas as a JSON string and URL-encode it
        const personasJson = JSON.stringify(charactersWithDetails);
        const encodedPersonas = encodeURIComponent(personasJson);
        const encodedPrompt = encodeURIComponent(prompt);
        const encodedContext = encodeURIComponent(instructions); // Updated to include the new context

        // Send the data to FastAPI backend (using your preferred method)

        // Construct the URL with query parameters
        const url = `http://0.0.0.0:8001/chat-stream?human_message=${encodedPrompt}&personas=${encodedPersonas}&context=${encodedContext}`;

        const eventSource = new EventSource(url);

        // Initialize a counter for character responses
        let responseCount = 0;
        const totalCharacters = characters.length;

        eventSource.onmessage = async (event) => {
          try {
            const response = JSON.parse(event.data);
            console.log(
              "✅ Received response from character:",
              response.character_index
            );

            // Validate and store the response
            if (
              response &&
              response.character_index !== undefined &&
              response.text
            ) {
              const cleanResponse = await Cleanresponse.create({
                _request_id: request._id,
                _account_id: input._account_id,
                _funspot_id: input._funspot_id,
                _character_index: response.character_index,
                text: response.text,
                emotion: input.emotion,
                is_read: false,
              });

              console.log(
                "✅ Response successfully stored in the database:",
                response.text
              );

              // // Deduct 1 token from the user's funds
              // try {
              //   const fund = await fundsModel.findOneAndUpdate(
              //     { _account_id: input._account_id },
              //     { $inc: { tokens: -1 } }, // Decrement tokens by 1
              //     { new: true } // Return the updated document
              //   );

              //   if (!fund) {
              //     console.error("Fund not found for user:", input._account_id);
              //     // Handle the case where the fund is not found, maybe throw an error or log it
              //   } else {
              //     console.log("💰💰💰Tokens deducted successfully. Remaining tokens:", fund.tokens);
              //   }
              // } catch (error) {
              //   console.error("Error deducting tokens:", error);
              //   // Handle the error appropriately, maybe revert the response creation
              // }

              // Deduct 1 token from the user's funds
              try {
                const existingFund = await Funds.findOne({
                  _account_id: input._account_id,
                });

                if (!existingFund) {
                  console.error("Fund not found for user:", input._account_id);
                  // Handle the case where the fund is not found, maybe throw an error or log it
                } else {
                  const updatedFund = await Funds.findOneAndUpdate(
                    { _account_id: input._account_id },
                    {
                      tokens: (() => {
                        const currentTokens = parseFloat(existingFund.tokens);
                        if (isNaN(currentTokens)) {
                          console.error(
                            "Invalid existing tokens value:",
                            existingFund.tokens
                          );
                          return existingFund.tokens; // Or handle the error differently
                        }
                        return (currentTokens - 1).toString(); // Deduct 1 token
                      })(),
                    },
                    { new: true } // Return the updated document
                  );

                  if (updatedFund) {
                    console.log(
                      "💰💰💰Tokens deducted successfully. Remaining tokens:",
                      updatedFund.tokens
                    );
                  } else {
                    console.error(
                      "Failed to update fund after deducting tokens."
                    );
                  }
                }
              } catch (error) {
                console.error("Error deducting tokens:", error);
                // Handle the error appropriately, maybe revert the response creation
              }

              // // Step 6: Publish each response after storing it
              // pubsub.publish("RESPONSE_CREATED", {
              //   responseCreated: cleanResponse,
              // });
              //clean response subscription
              // cleanresponseCreated: {
              //   subscribe: () => pubsub.asyncIterator(["CLEANRESPONSE_CREATED"]),
              // },

              // Step 6: Publish each response after storing it
              pubsub.publish("CLEANRESPONSE_CREATED", {
                cleanresponseCreated: cleanResponse,
              });

              // Increment the response count
              responseCount++;

              // If all characters have responded, close the SSE connection
              if (responseCount === totalCharacters) {
                console.log(
                  "✅ All characters have responded. Closing SSE connection."
                );
                eventSource.close(); // Close the connection once all responses are received
              }
            } else {
              console.error("Unexpected response format:", response);
            }
          } catch (error) {
            console.error("Error processing SSE response:", error);
          }
        };

        // Step 7: Handle errors from the SSE connection
        eventSource.onerror = (error) => {
          console.error("Error in SSE connection:", error);
          eventSource.close(); // Close the connection on error to avoid infinite loop
        };

        // Step 8: Close the SSE connection when the server sends a close event
        eventSource.onclose = () => {
          console.log("SSE connection closed.");
        };

        return request;
      } catch (error) {
        console.error("Error creating request:", error);
        throw new Error("Error creating request");
      }
    },





















    deleteRequest: async (_: any, { _request_id }: { _request_id: string }) => {
      try {
        const request = await Request.findByIdAndDelete(_request_id);
        if (!request) {
          throw new Error("Request not found"); // Handle not found case
        }
        return request;
      } catch (error) {
        console.error(error); // Log the error for debugging
        throw new Error("Error deleting request"); // Generic error for client
      }
    },
  },
  Subscription: {
    requestCreated: {
      subscribe: () => pubsub.asyncIterator(["REQUEST_CREATED"]),
    },
  },
};
