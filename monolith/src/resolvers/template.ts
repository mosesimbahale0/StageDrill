// src/resolvers/client.ts
import Templates from "../models/template.model.js";
import Customer from "../models/customer.model.js";
import Funspot from "../models/funspot.model.js";
// new src/resolvers/client.ts
import { pubsub } from "../utils/redisDb.js";

export const templateResolvers = {
  Query: {
    getAllTemplates: async (_: any, { skip = 0, limit = 10 }: any) => {
      try {
        const templates = await Templates.find()
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }); // Optional: sort by creation date, newest first
        return templates;
      } catch (error) {
        throw error;
      }
    },

    countTemplates: async () => {
      try {
        return await Templates.countDocuments();
      } catch (error) {
        throw new Error(error.message);
      }
    },

    //--------------------------------------------------

    getTemplateById: async (_: any, { templateId }: any) => {
      try {
        const template = await Templates.findById(templateId);
        return template;
      } catch (error) {
        throw error;
      }
    },

    //------------------------KEYWORD SEARCH---------------//

    keywordSearch: async (_: any, { keyword }: any) => {
      try {
        const templates = await Templates.find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        });
        return templates;
      } catch (error) {
        throw error;
      }
    },

    semanticSearch: async (_: any, { query, top_k }: any) => {
      try {
        // Set defaults for optional parameters
        top_k = top_k || 50;
        // Combine alpha with query and top_k
        

        // Send request to hybrid search service
        const response = await fetch(
          "http://localhost:8003/api/v1/hybrid-search",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, top_k }),
          }
        );

        // Handle HTTP errors
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `Hybrid search request failed: ${response.status} - ${errorBody}`
          );
        }

        const data: any = await response.json();
        console.log("HYBRID RESPONSE:", JSON.stringify(data, null, 2));

        // Validate response structure
        if (
          !data ||
          typeof data.query !== "string" ||
          !Array.isArray(data.results)
        ) {
          throw new Error("Invalid response format from search service");
        }

        // Extract IDs from results
        const ids = data.results.map((item: any) => item.id);
        if (ids.length === 0) {
          console.warn("Hybrid search returned no results");
          return [];
        }

        // Fetch templates from database
        const templatesFromDB = await Templates.find({ _id: { $in: ids } });

        // Handle missing templates
        if (!templatesFromDB || templatesFromDB.length === 0) {
          console.error("No templates found for IDs:", ids);
          return [];
        }

        // Create mapping for quick lookup
        const templateMap = new Map(
          templatesFromDB.map((template) => [template._id.toString(), template])
        );

        // Maintain original search ranking order
        const sortedTemplates = ids
          .map((id) => templateMap.get(id.toString()))
          .filter((template) => template !== undefined) as any[];

        // Warn about missing templates
        if (sortedTemplates.length !== data.results.length) {
          const missingCount = data.results.length - sortedTemplates.length;
          console.warn(`${missingCount} templates missing from database`);
        }

        return sortedTemplates;
      } catch (error: any) {
        console.error("Hybrid search error:", {
          query,
          top_k,
          error: error.message,
        });

        // Rethrow with additional context
        throw new Error(`Search failed: ${error.message}`);
      }
    },





    hybridSearch: async (_: any, { query, top_k }: any) => {
      try {
        // Set defaults for optional parameters
        top_k = top_k || 50;
        // Combine alpha with query and top_k
        

        // Send request to hybrid search service
        const response = await fetch(
          "http://localhost:8003/api/v1/hybrid-search",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, top_k }),
          }
        );

        // Handle HTTP errors
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `Hybrid search request failed: ${response.status} - ${errorBody}`
          );
        }

        const data: any = await response.json();
        console.log("HYBRID RESPONSE:", JSON.stringify(data, null, 2));

        // Validate response structure
        if (
          !data ||
          typeof data.query !== "string" ||
          !Array.isArray(data.results)
        ) {
          throw new Error("Invalid response format from search service");
        }

        // Extract IDs from results
        const ids = data.results.map((item: any) => item.id);
        if (ids.length === 0) {
          console.warn("Hybrid search returned no results");
          return [];
        }

        // Fetch templates from database
        const templatesFromDB = await Templates.find({ _id: { $in: ids } });

        // Handle missing templates
        if (!templatesFromDB || templatesFromDB.length === 0) {
          console.error("No templates found for IDs:", ids);
          return [];
        }

        // Create mapping for quick lookup
        const templateMap = new Map(
          templatesFromDB.map((template) => [template._id.toString(), template])
        );

        // Maintain original search ranking order
        const sortedTemplates = ids
          .map((id) => templateMap.get(id.toString()))
          .filter((template) => template !== undefined) as any[];

        // Warn about missing templates
        if (sortedTemplates.length !== data.results.length) {
          const missingCount = data.results.length - sortedTemplates.length;
          console.warn(`${missingCount} templates missing from database`);
        }

        return sortedTemplates;
      } catch (error: any) {
        console.error("Hybrid search error:", {
          query,
          top_k,
          error: error.message,
        });

        // Rethrow with additional context
        throw new Error(`Search failed: ${error.message}`);
      }
    },




    
  },
  Mutation: {
    // Clone Template
    //---------------------------------------------------
    cloneTemplate: async (
      _: any,
      { _account_id, _template_id, characters, name, description }: any
    ) => {
      try {
        // Find the template by ID
        const template = await Templates.findById(_template_id);

        if (!template) {
          throw new Error("Template not found");
        }

        // Create a new funspot
        const funspot = await Funspot.create({
          _template_Id: _template_id,
          _account_Id: _account_id,
          name: name,
          description: description,
          cover: "/funspots/illustration.png",
          context: template.context,
          examples: template.examples,
          summary: template.summary,
          characters: characters,
          ml_model: template.ml_model,
        });

        // Update the template's cloners array
        await Templates.findByIdAndUpdate(
          _template_id,
          { $push: { cloners: { _account_id: _account_id } } },
          { new: true }
        );

        return funspot;
      } catch (error) {
        throw error;
      }
    },
    //---------------------------------------------------

    //------------------------START OF TEMPLATES---------------//
    // Create a template, update & delete a template
    createTemplate: async (_: any, { input }: any) => {
      try {
        const template = await Templates.create(input);
        // pubsub.publish("TEMPLATE_CREATED", { templateCreated: template });
        return template;
      } catch (error) {
        throw error;
      }
    },

    updateTemplate: async (_: any, { templateId, input }: any) => {
      try {
        const template = await Templates.findByIdAndUpdate(templateId, input, {
          new: true,
        });
        // pubsub.publish("TEMPLATE_UPDATED", { templateUpdated: template });
        return template;
      } catch (error) {
        throw error;
      }
    },

    deleteTemplate: async (_: any, { templateId }: any) => {
      try {
        const template = await Templates.findByIdAndDelete(templateId);
        // pubsub.publish("TEMPLATE_DELETED", { templateDeleted: template });
        return template;
      } catch (error) {
        throw error;
      }
    },

    combinedTemplateLikingLogic: async (
      _: any,
      { customerId, templateId }: any
    ) => {
      try {
        const template = await Templates.findById(templateId);
        const customer = await Customer.findById(customerId);
        const input = { _template_id: templateId };
        const input2 = { _account_id: customerId };

        if (!template) {
          throw new Error("Template not found");
        }
        if (!customer) {
          throw new Error("Customer not found");
        }

        // Check if the customer has already liked the template
        const isLiked = customer.likes.some(
          (like) => like._template_id === input._template_id
        );

        let updatedTemplate;
        let updatedCustomer;
        if (!isLiked) {
          // Like the template
          updatedTemplate = await Templates.findByIdAndUpdate(
            templateId,
            { $push: { liking: input2 } },
            { new: true }
          );
          updatedCustomer = await Customer.findByIdAndUpdate(
            customerId,
            { $push: { likes: input } },
            { new: true }
          );
        } else {
          // Unlike the template
          updatedTemplate = await Templates.findByIdAndUpdate(
            templateId,
            { $pull: { liking: input2 } },
            { new: true }
          );
          updatedCustomer = await Customer.findByIdAndUpdate(
            customerId,
            { $pull: { likes: input } },
            { new: true }
          );
        }

        pubsub.publish("LIKING_CHANGED", {
          likingLogicChanged: updatedTemplate,
        });

        return updatedTemplate;
      } catch (error) {
        throw error; // Handle errors appropriately (e.g., logging, returning an error response)
      }
    },

    ratingTemplateLogic: async (
      _: any,
      { customerId, templateId, stars, text }: any
    ) => {
      try {
        // Validate input data (optional)
        if (stars === null || stars === undefined || isNaN(stars)) {
          throw new Error("Invalid stars value. Please enter a number.");
        }
        if (text === null || text === undefined || text.trim() === "") {
          throw new Error("Please enter a review text.");
        }

        const template =
          await Templates.findById(templateId).populate("rating");
        if (!template) {
          throw new Error("Template not found");
        }

        const customer = await Customer.findById(customerId);
        if (!customer) {
          throw new Error("Customer not found");
        }

        const input = { _template_id: templateId }; // Reference to the template
        const input2 = { _account_id: customerId, stars, text }; // Review details

        // Check if the customer has already rated this template
        const existingReviewIndex = template.rating.findIndex(
          (review) => review._account_id.toString() === customerId
        );

        let updatedTemplate;
        if (existingReviewIndex !== -1) {
          updatedTemplate = template; // Copy template object for modification
          updatedTemplate.rating.push(input2);
          // customer.rates.push(input); //DO NOT Update customer's rates with basic info
        } else {
          // Create new review
          updatedTemplate = template; // Copy template object for modification
          updatedTemplate.rating.push(input2);
          customer.rates.push(input); // Update customer's rates with basic info
        }

        await customer.save(); // Save customer first for reference (if using rates)
        await updatedTemplate.save(); // Save updated template

        return updatedTemplate;
      } catch (error) {
        throw error; // Handle errors more specifically for better user experience
      }
    },

    //Pull rating if the _account_id matches the customerId
    deleteRatingByCustomerId: async (
      _: any,
      { templateId, customerId }: any
    ) => {
      try {
        const template = await Templates.findById(templateId);
        if (!template) {
          throw new Error("Template not found");
        }
        const reviewIndex = template.rating.findIndex(
          (review) => review._account_id === customerId
        );
        if (reviewIndex !== -1) {
          template.rating.splice(reviewIndex, 1);
        }
        await template.save();
        return template;
      } catch (error) {
        throw error;
      }
    },
  },
  Subscription: {
    likingLogicChanged: {
      subscribe: () => pubsub.asyncIterator(["LIKING_CHANGED"]),
    },
  },
};
