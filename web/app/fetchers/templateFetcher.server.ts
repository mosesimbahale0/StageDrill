import { 
  GET_ONE_TEMPLATE, 
  GET_ALL_TEMPLATES, 
  LIKE_TEMPLATE, 
  REVIEW_TEMPLATE,
  SEMANTIC_SEARCH,
  GET_ALL_AVATARS,
  GET_ALL_LANGUAGES,
  CLONE_TEMPLATE_MUTATION
 } from "~/graphql/templateQueries";
import { ErrorSchema, TemplateSchema } from "~/types";

import { GRAPHQL_API_URL } from "~/utils/config";

// Fetch One Template
// -------------------------------------------------------------------------------------------
export const fetchOneTemplate = async (
  templateId: string
): Promise<TemplateSchema | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ONE_TEMPLATE,
        variables: { templateId: templateId },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to fetch template.");
    }

    return data.data.getTemplateById as TemplateSchema;
  } catch (error: any) {
    console.error("Error fetching template:", error.message);
    return { message: "Failed to fetch template", status: 500 };
  }
};


// Fetch All templates with Pagination
export const fetchAllTemplates = async (
  skip: number,
  limit: number
): Promise<TemplateSchema[] | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ALL_TEMPLATES,
        variables: { skip, limit },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch templates."
      );
    }

    return data.data.getAllTemplates as TemplateSchema[];
  } catch (error: any) {
    console.error("Error fetching templates:", error.message);
    return { message: "Failed to fetch templates", status: 500 };
  }
};



// like template 
// ----------------------------------------------------------------------------------------
export const likeTemplate= async (
  customerId: string,
  templateId: string
): Promise<TemplateSchema | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: LIKE_TEMPLATE,
        variables: { customerId, templateId },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to like template.");
    }

    return data.data.combinedTemplateLikingLogic as TemplateSchema;
  } catch (error: any) {
    console.error("Error liking template:", error.message);
    return { message: "Failed to like template", status: 500 };
  }
};


//  review template
// ----------------------------------------------------------------------------------------
export const reviewTemplate = async (
  customerId: string,
  templateId: string,
  stars: string,
  text: string
): Promise<TemplateSchema | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: REVIEW_TEMPLATE,
        variables: { customerId, templateId, stars, text },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to review template."
      );
    }

    return data.data.ratingTemplateLogic as TemplateSchema;
  } catch (error: any) {
    console.error("Error reviewing template:", error.message);
    return { message: "Failed to review template", status: 500 };
  }
};





// Search template
// -----------------------------------------------------------------------------------------
export const searchTemplates = async (
  query: string,
  topK: number
): Promise<TemplateSchema[] | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: SEMANTIC_SEARCH,
        variables: { query, topK },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to search template.");
    }

    return data.data.semanticSearch as TemplateSchema[];
  } catch (error: any) {
    console.error("Error searching template:", error.message);
    return { message: "Failed to search template", status: 500 };
  }
};



// Get all avatars
export const fetchAllAvatars = async (): Promise<any[] | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ALL_AVATARS,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to fetch avatars.");
    }

    return data.data.getAllAvatars;
  } catch (error: any) {
    console.error("Error fetching avatars:", error.message);
    return { message: "Failed to fetch avatars", status: 500 };
  }
};

// Get all languages
export const fetchAllLanguages = async (): Promise<any[] | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_ALL_LANGUAGES,
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch languages."
      );
    }

    return data.data.getAllLanguages;
  } catch (error: any) {
    console.error("Error fetching languages:", error.message);
    return { message: "Failed to fetch languages", status: 500 };
  }
};


// Clone Template
export const cloneTemplate = async (
  accountId: string,
  templateId: string,
  characters: any[],
  name: string,
  description: string
): Promise<any | ErrorSchema> => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: CLONE_TEMPLATE_MUTATION,
        variables: { accountId, templateId, characters, name, description },
      }),
    });

    const data = await response.json();
    if (!response.ok || data.errors) {
      throw new Error(data.errors?.[0]?.message || "Failed to clone template.");
    }

    return data.data.cloneTemplate;
  } catch (error: any) {
    console.error("Error cloning template:", error.message);
    return { message: "Failed to clone template", status: 500 };
  }
};



