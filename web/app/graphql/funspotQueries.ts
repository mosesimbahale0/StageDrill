export const MEDIATE_REQUEST_MUTATION = `
  mutation MediateRequest($input: RequestInput!) {
    mediateRequest(input: $input) { 
      _id
      _account_id
      _funspot_id
      text
      emotion
      createdAt
      updatedAt
    }
  }
`;

export const REQUEST_CREATED_SUBSCRIPTION = `
  subscription {
    requestCreated {
      _id
      _account_id
      _funspot_id
      text
      emotion
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_REQUESTS_BY_ID = `
  query GetAllRequestsByFunspotId($funspotId: ID!) {
    getAllRequestsByFunspotId(funspotId: $funspotId) {
      _id
      _account_id
      _funspot_id
      text
      emotion
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_RESPONSES = `
  query GetAllCleanresponsesByRequestId($requestId: ID!) {
    getAllCleanresponsesByRequestId(requestId: $requestId) {
      _id
      _request_id
      _account_id
      _funspot_id
      _character_index
      text
      emotion
      is_read
    }
  }
`;

export const MESSAGE_RECEIVED = `
  subscription {
    cleanresponseCreated {
      _id
      _request_id
      _account_id
      _funspot_id
      _character_index
      text
      audio
      emotion
      is_read
    }
  }
`;

//  Get One Funspot
export const GET_ONE_FUNSPOT = `
query GetOneFunspotById($funspotId: ID!) {
  getOneFunspotById(funspotId: $funspotId) {
    _id
    _template_Id
    _account_Id
    name
    cover
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
    characters {
      _character_index
      character_name
      character_role
      character_voice
      character_language
      character_gender
      
      _avatar_id
      _language_id
    }
    ml_model
    createdAt
    updatedAt
  }
}
`;

// Get profile
export const GET_PROFILE = `
  query GetCustomerByUid($uid: String!) {
    getCustomerByUid(uid: $uid) {
      _id
      _uid
      name
      phone
      location
      profession
      sex
      bday
      rates {
        _template_id
      }
      likes {
        _template_id
      }
      createdAt
      updatedAt
    }
  }
`;

//  Get Balance
export const GET_BALANCE = `
  query GetFundByAccountId($accountId: String!) {
    getFundByAccountId(accountId: $accountId) {
      _id
      _account_id
      _paypal_id
      is_active
      tokens
      createdAt
      updatedAt
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

export const GET_ALL_FUNSPOTS = `
query GetAllFunspotsByCustomerID($customerId: ID!) {
  getAllFunspotsByCustomerID(customerId: $customerId) {
    _id
    _template_Id
    _account_Id
    name
    cover
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
    characters {
      _character_index
      character_name
      character_role
      character_voice
      character_language
      character_gender
      


      _avatar_id
      _language_id
    }
    ml_model
    createdAt
    updatedAt
  }
}
`;

// Delete funspot
export const DELETE_FUNSPOT = `
mutation DeleteFunspot($funspotId: ID!) {
  deleteFunspot(funspotId: $funspotId) {
    _id
    _template_Id
    _account_Id
    name
    cover
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
    characters {
      _character_index
      character_name
      character_role
      _avatar_id
      _language_id
    }
    ml_model
    createdAt
    updatedAt
  }
}
`;

export const GET_PROFILE_BY_ACCOUNT_ID = `
query GetCustomer($customerId: ID!) {
  getCustomer(customerId: $customerId) {
    _id
    _uid
    _paypal_ids {
      _paypal_id
    }
    name
    language
    language_code
    phone
    location
    profession
    sex
    bday
    rates {
      _template_id
    }
    likes {
      _template_id
    }
    createdAt
    updatedAt
  }
}

`;


// export const GET 
