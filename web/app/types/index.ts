
export interface RequestData {
    _id: string;
    _account_id: string;
    _funspot_id: string;
    text: string;
    emotion: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ResponseData {
    _id: string;
    _request_id: string;
    text: string;
    emotion: string;
  }
  
  
  
// Template interface types
export interface Template {
  _account_id: string;
  _id: string;
  cloners: {
      _account_id: string;
  }[];
  context: string;
  cover: string;
  description: string;
  examples: {
      InputOutputTextPair: {
          _character_index: number;
          input_text: string;
          output_text: string;
      }[];
  }[];
  liking: {
      _account_id: string;
  }[];
  ml_model: string;
  name: string;
  rating: {
      _account_id: string;
      stars: number;
      text: string;
  }[];
  summary: string;
  role: string;
}


// Funspot interface types
export interface FunspotSchema {
    _id: string;
    _template_Id: string;
    _account_Id: string;
    name: string;
    cover: string;
    description: string;
    context: string;
    examples: {
        InputOutputTextPair: {
            _character_index: number;
            input_text: string;
            output_text: string;
        }[];
    }[];
    summary: string;
    characters: {
        _character_index: number;
        character_name: string;
        character_role: string;
        _avatar_id: string;
        _language_id: string;
    }[];
    ml_model: string;
    createdAt: string;
    updatedAt: string;
}


export interface ProfileSchema {
    _id: string;
    _uid: string;
    name: string;
    phone: string;
    location: string;
    profession: string;
    sex: string;
    bday: string;
    rates: {
        _template_id: string;
    }[];
    likes: {
        _template_id: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface BalanceSchema {
    _id: string;
    _account_id: string;
    _paypal_id: string;
    is_active: boolean;
    tokens: number;
    createdAt: string;
    updatedAt: string;
}



export interface ErrorSchema {
    message: string;
    status: number;
}

 

  export interface UserSchema {
    uid: string;
    email: string;
    displayName: string;
    accessToken: string;
  }




  export interface TemplateSchema {
    _id: string;
    _account_id: string;
    ml_model: string;
    name: string;
    description: string;
    context: string;
    examples: {
      InputOutputTextPair: {
        _character_index: number;
        input_text: string;
        output_text: string;
      }[];
    }[];
    summary: string;
    role: string;
    tags: string[];
    licence: string;
    cover: string;
    cloners: {
      _account_id: string;
    }[];
    liking: {
      _account_id: string;
    }[];
    rating: {
      _account_id: string;
      stars: number;
      text: string;
    }[];
  }


// avatar schema
export interface AvatarSchema {
    _id: string;
    name: string;
    photo: string;
    threed_model: string;
    voice_type: string;
    voice_name: string;
    SSML_gender: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LanguageSchema {
    _id: string;
    name: string;
    language_code: string;
  }
  
  export interface CharacterInput {
    _character_index: number;
    character_name: string;
    character_role: string;
    _avatar_id: string;
    _language_id: string;
  }
  


  export interface Countries {
    _id: string;
    name: string;
    code: string;
    emoji: string;
  }
  

  export interface CustomerLanguages {
    _id: string;
    name: string;
    language_code: string;
  }


  //  LIke 
export interface LikeSchema {
    _id: string;
    _account_id: string;
    _template_id: string;
    createdAt: string;
    updatedAt: string;
  }


  // Review
export interface ReviewSchema {
    _id: string;
    _account_id: string;
    _template_id: string;
    stars: number;
    text: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Transaction {
    _id: string;
    _account_id: string;
    _paypal_id: string;
    _paypal_transaction_id: string;
    transaction_status: string;
    createdAt: string;
    updatedAt: string;
  }
