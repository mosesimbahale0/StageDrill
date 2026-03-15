// get one template
export const GET_ONE_TEMPLATE = `
query GetTemplateById($templateId: ID!) {
  getTemplateById(templateId: $templateId) {
    _id
    _account_id
    ml_model
    name
    description
    context
    examples {
      InputOutputTextPair {
        _character_index
        input_text
        output_text
      }
    }
    summary
    role
    tags
    licence
    cover
    cloners {
      _account_id
    }
    liking {
      _account_id
    }
    rating {
      _account_id
      stars
      text
    }
  }
}
  `;

// get all templates
export const GET_ALL_TEMPLATES = `
    query GetAllTemplates($skip: Int, $limit: Int) {
    getAllTemplates(skip: $skip, limit: $limit) {
      _id
      _account_id
      ml_model
      name
      description
      context
      summary
      role
      cover
      cloners {
        _account_id
      }
      liking {
        _account_id
      }
      rating {
        _account_id
        stars
        text
      }
    }
  }
  `;

// like template
export const LIKE_TEMPLATE = `
mutation CombinedTemplateLikingLogic($customerId: ID!, $templateId: ID!) {
  combinedTemplateLikingLogic(customerId: $customerId, templateId: $templateId) {
    _id
    _account_id
    ml_model
    name
    description
    context
    examples {
      InputOutputTextPair {
        _character_index
        input_text
        output_text
      }
    }
    summary
    role
    tags
    licence
    cover
    cloners {
      _account_id
    }
    liking {
      _account_id
    }
    rating {
      _account_id
      stars
      text
    }
  }
}
  `;

//  review template
export const REVIEW_TEMPLATE = `
mutation RatingTemplateLogic($customerId: ID!, $templateId: ID!, $stars: String!, $text: String!) {
  ratingTemplateLogic(customerId: $customerId, templateId: $templateId, stars: $stars, text: $text) {
    _id
    _account_id
    ml_model
    name
    description
    context
    examples {
      InputOutputTextPair {
        _character_index
        input_text
        output_text
      }
    }
    summary
    role
    tags
    licence
    cover
    cloners {
      _account_id
    }
    liking {
      _account_id
    }
    rating {
      _account_id
      stars
      text
    }
  }
}
`;

export const SEMANTIC_SEARCH = `
query SemanticSearch($query: String!, $topK: Int!) {
  semanticSearch(query: $query, top_k: $topK) {
    _id
    _account_id
    ml_model
    name
    description
    context
    examples {
      InputOutputTextPair {
        _character_index
        input_text
        output_text
      }
    }
    summary
    role
    tags
    licence
    cover
    cloners {
      _account_id
    }
    liking {
      _account_id
    }
    rating {
      _account_id
      stars
      text
    }
  }
}
`;

export const GET_ALL_AVATARS = `
  query GetAllAvatars {
    getAllAvatars {
      _id
      name
      photo
      threed_model
      voice_type
      voice_name
      SSML_gender
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_LANGUAGES = `
  query GetAllLanguages {
    getAllLanguages {
      _id
      name
      language_code
    }
  }
`;

export const CLONE_TEMPLATE_MUTATION = `
  mutation CloneTemplate(
    $accountId: ID!
    $templateId: ID!
    $characters: [characterInput]!
    $name: String!
    $description: String!
  ) {
    cloneTemplate(
      _account_id: $accountId
      _template_id: $templateId
      characters: $characters
      name: $name
      description: $description
    ) {
      _account_Id
      _id
      characters {
        _character_index
        character_name
        character_role
        _avatar_id
        _language_id
      }
      _template_Id
      context
      cover
      createdAt
      description
      examples {
        InputOutputTextPair {
          input_text
          output_text
        }
      }
      ml_model
      name
      summary
      updatedAt
    }
  }

`;
