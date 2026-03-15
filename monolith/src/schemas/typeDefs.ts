// src/schemas/typeDefs.ts
import { gql } from "graphql-tag";

export default gql`
  #-------------- request ---------------#
  type Request {
    _id: ID
    _account_id: String
    _funspot_id: String
    text: String
    emotion: String

    createdAt: String
    updatedAt: String
  }

  input RequestInput {
    _account_id: String!
    _funspot_id: String!
    text: String!
    emotion: String
  }

  #-------------- response ---------------#
  type Response {
    _id: ID!
    _request_id: String!
    _account_id: String!
    _funspot_id: String!
    _index: Int!
    text: String
    emotion: String
    is_read: Boolean
  }

  input ResponseInput {
    _request_id: String!
    _account_id: String!
    _funspot_id: String!
    _index: Int!
    text: String!
    emotion: String
    is_read: Boolean
  }

  #------------------------------------------------------

  #--------------clean_response ---------------#
  type Cleanresponse {
    _id: ID!
    _request_id: String!
    _account_id: String!
    _funspot_id: String!
    _character_index: Int!
    text: String
    emotion: String
    is_read: Boolean
  }

  input CleanresponseInput {
    _request_id: String!
    _account_id: String!
    _funspot_id: String!
    _character_index: Int!
    text: String!
    emotion: String
    is_read: Boolean
  }

  # -------------------------------------------

  # legal
  #----------------------------------------------------
  type Legal {
    _id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  # Article
  #----------------------------------------------------
  type Articles {
    _id: ID!
    title: String!
    content: String!
    video: String!
    image: String!
    createdAt: String!
    updatedAt: String!
  }

  # funspot
  #----------------------------------------------------
  type Funspot {
    _id: ID!
    _template_Id: String!
    _account_Id: String
    name: String!
    cover: String!
    description: String!

    context: String!
    examples: [example]

    summary: String!
    characters: [character]
    ml_model: String

    createdAt: String!
    updatedAt: String!
  }

  type example {
    InputOutputTextPair: [sample!]!
  }
  type sample {
    _character_index: Int!
    input_text: String!
    output_text: String!
  }

  input exampleInput {
    InputOutputTextPair: [sampleInput!]!
  }
  input sampleInput {
    _character_index: Int!
    input_text: String!
    output_text: String!
  }

  type character {
    _character_index: Int!
    character_name: String!
    character_role: String!
    character_voice: String
    character_gender: String
    character_language: String

    _avatar_id: String!
    _language_id: String!
  }

  input characterInput {
    _character_index: Int!
    character_name: String!
    character_voice: String
    character_gender: String
    character_language: String
    
    character_role: String!
    _avatar_id: String!
    _language_id: String!
  }

  input FunspotInput {
    _template_Id: String!
    _account_Id: String!
    name: String!
    cover: String!
    description: String!

    context: String!
    examples: [exampleInput]

    summary: String!
    characters: [characterInput]
    ml_model: String!
  }

  input FunspotUpdateInput {
    _template_Id: String!
    _account_Id: String!
    name: String!
    cover: String!
    description: String!

    context: String!
    examples: [exampleInput]

    summary: String!
    characters: [characterInput]
    ml_model: String!
  }

  # customer
  #---------------------------------------------------
  type Customer {
    _id: ID
    _uid: String
    _paypal_ids: [paypal_id]

    name: String
    language: String
    language_code: String
    phone: String
    location: String
    profession: String
    sex: String
    bday: String

    rates: [rate]
    likes: [like]

    createdAt: String!
    updatedAt: String!
  }

  type paypal_id {
    _paypal_id: String
  }

  type rate {
    _template_id: String
  }

  type like {
    _template_id: String
  }

  input CustomerInput {
    _uid: String
    _paypal_ids: [paypal_id_input]

    name: String
    language: String
    language_code: String
    phone: String
    location: String
    profession: String
    sex: String
    bday: String

    rates: [rate_input]
    likes: [like_input]
  }

  input paypal_id_input {
    _paypal_id: String
  }
  input rate_input {
    _template_id: String
  }

  input like_input {
    _template_id: String
  }

  input CustomerUpdateInput {
    _uid: String
    _paypal_ids: [paypal_id_input]

    name: String
    language: String
    language_code: String
    phone: String
    location: String
    profession: String
    sex: String
    bday: String

    rates: [rate_input]
    likes: [like_input]
  }

  input CustomerPaypalUpdateInput {
    _uid: String! # Add this field
    _paypal_ids: [paypal_id_input]
  }

  # Template
  #----------------------------------------
  type Template {
    _id: ID!
    _account_id: String
    ml_model: String

    name: String
    description: String

    context: String
    examples: [example]

    summary: String
    role: String

    tags: String
    licence: String

    cover: String!
    cloners: [cloner]
    liking: [liker]

    rating: [review]
  }

  type liker {
    _account_id: String
  }
  input likerInput {
    _account_id: String
  }
  type cloner {
    _account_id: String
  }

  input templateInput {
    _account_id: String!
    name: String
    description: String
    cover: String

    summary: String

    ml_model: String
    role: String

    context: String
    examples: [exampleInput]

    tags: String
    licence: String

    cloners: [clonerInput]
    liking: [likerInput]
    rating: [reviewInput]
  }

  input clonerInput {
    _account_id: String
  }
  type review {
    _account_id: ID!
    stars: String!
    text: String!
  }
  input reviewInput {
    _account_id: ID!
    stars: String!
    text: String!
  }

  input templateUpdateInput {
    _account_id: String!
    name: String
    description: String
    cover: String

    summary: String

    ml_model: String
    role: String

    context: String
    examples: [exampleInput]

    cloners: [clonerInput]
    liking: [likerInput]
    rating: [reviewInput]
  }
  #------------------------------------------------

  # Avatar
  #----------------------------------------
  type Avatar {
    _id: ID!
    name: String!
    photo: String!
    threed_model: String!
    voice_type: String!
    voice_name: String!
    SSML_gender: String!
    language_code: String
    createdAt: String
    updatedAt: String
  }

  input avatarInput {
    name: String!
    photo: String!
    threed_model: String!
    voice_type: String!
    voice_name: String!
    SSML_gender: String!
    language_code: String
  }

  input avatarUpdateInput {
    name: String!
    photo: String!
    threed_model: String!
    voice_type: String!
    voice_name: String!
    SSML_gender: String!
    language_code: String
  }

  # Language
  #----------------------------------------
  type Language {
    _id: ID!
    name: String!
    language_code: String!
  }

  input languageInput {
    name: String!
    language_code: String!
  }

  input languageUpdateInput {
    name: String!
    language_code: String!
  }

  #------------------------------------------------

  # customerlanguage
  #----------------------------------------
  type Customerlanguage {
    _id: ID!
    name: String!
    language_code: String!
  }

  input customerlanguageInput {
    name: String!
    language_code: String!
  }

  input customerlanguageUpdateInput {
    name: String!
    language_code: String!
  }

  #------------------------------------------------

  # Country
  #----------------------------------------
  type Country {
    _id: ID!
    name: String
    code: String
    emoji: String
    unicode: String
    image: String
  }
  #------------------------------------------------

  # Funds
  #---------------------------------------------------
  type Fund {
    _id: ID
    _account_id: String
    _paypal_id: String
    is_active: Boolean
    tokens: String
    createdAt: String
    updatedAt: String
  }

  input FundInput {
    _paypal_id: String
    _account_id: String
    is_active: Boolean
    tokens: String!
  }

  input FundUpdateInput {
    _paypal_id: String
    _account_id: String
    is_active: Boolean
    tokens: String
  }
  #------------------------------------------------

  # Transactions
  #---------------------------------------------------
  type Transaction {
    _id: ID
    _account_id: String
    _paypal_id: String
    _paypal_transaction_id: String
    transaction_status: String
    createdAt: String
    updatedAt: String
  }

  input TransactionInput {
    _account_id: String!
    _paypal_id: String!
    _paypal_transaction_id: String!
    transaction_status: String!
  }

  input TransactionUpdateInput {
    _account_id: String!
    _paypal_id: String!
    _paypal_transaction_id: String!
    transaction_status: String!
  }

  # Notification
  #-----------------------------------------------------
  type Notification {
    _id: ID!
    _account_id: String
    _paypal_id: String
    _paypal_transaction_id: String
    transaction_status: String
    is_read: Boolean
    text: String
    from: String
    createdAt: String
    updatedAt: String
  }

  input NotificationInput {
    _account_id: String
    _paypal_id: String
    _paypal_transaction_id: String
    transaction_status: String
    is_read: Boolean
    text: String
    from: String
  }

  input NotificationUpdateInput {
    _paypal_id: String!
    _paypal_transaction_id: String!
    transaction_status: String!
    is_read: Boolean!
    text: String!
    from: String!
  }

  # createUserPaypalRecords custom input
  # ----------------------------------
  input createUserPaypalRecordsInput {
    customer: CustomerPaypalUpdateInput!
    notification: NotificationInput!
    transaction: TransactionInput!
  }
  #---------------------------------------------------

  type Query {
    #----------------------------------------------------------
    # Language
    #-------------------------------------------------------------
    getAllLanguages: [Language!]!
    getOneLanguage(_id: ID!): Language!
    #-------------------------------------------------------------

    # --------------------------------------------------------------
    # customerlanguage
    # ---------------------------------------------------------------
    getAllCustomerLanguages: [Customerlanguage!]!
    getOneCustomerLanguage(_id: ID!): Customerlanguage!
    #-------------------------------------------------------------

    # Contries
    # ----------------------------------------------------------------
    getAllCountries: [Country!]!
    getOneCountry(_id: ID!): Country!
    #-------------------------------------------------------------

    #----------------------------------------------------------
    # Avatars R
    #-------------------------------------------------------------
    getAllAvatars: [Avatar!]!
    getOneAvatar(_id: ID!): Avatar!

    #----------------------------------------------------------
    # Customer R
    #-------------------------------------------------------------
    #-------------------------------------
    getCustomer(customerId: ID!): Customer!
    getCustomerByUid(uid: String!): Customer

    #----------------------------------------------------------
    # Templates
    #-------------------------------------------------------------
    #----------------------------------------------
    getAllTemplates(skip: Int, limit: Int): [Template]

    countTemplates: Int

    getTemplateById(templateId: ID!): Template

    #----------------------------------------------------------
    # Search
    #-------------------------------------------------------------
    #---------------------------------------------------
    keywordSearch(keyword: String!): [Template]
    #----------------------------------------------------------

    #----------------------------------------------------------
    # Semantic Search at localhost 8003
    #-------------------------------------------------------------
    #---------------------------------------------------
    semanticSearch(query: String!, top_k: Int!): [Template]
    #----------------------------------------------------------


    #----------------------------------------------------------
    # Hybrid Search 
    #-------------------------------------------------------------
    hybridSearch(query: String!, top_k: Int!,): [Template]




    #----------------------------------------------------------
    # Funspots
    #-------------------------------------------------------------
    #------------------------------------------------
    getAllFunspotsByCustomerID(customerId: ID!): [Funspot]
    getOneFunspotById(funspotId: ID!): Funspot
    #---------------------------------------------------

    #----------------------------------------------------------
    # Legals
    #-------------------------------------------------------------
    #------------------------------------------------
    getAlllegals: [Legal!]!
    getOneLegal(_id: ID!): Legal!
    #----------------------------------------------------------

    #----------------------------------------------------------
    # Articles
    #-------------------------------------------------------------
    getAllArticles: [Articles!]!
    getOneArticle(_id: ID!): Articles!
    #----------------------------------------------------------

    #----------------------------------------------------------
    # Requests
    #-------------------------------------------------------------
    getRequestById(_request_id: ID!): Request!
    getAllRequestsByFunspotId(funspotId: ID!): [Request]
    #----------------------------------------------------------
    #----------------------------------------------------------
    # Responses
    #-------------------------------------------------------------
    getResponseById(_response_id: ID!): Response!
    getAllResponsesByRequestId(requestId: ID!): [Response]
    #-------------------------------------------------------

    # Clean Responses
    # -------------------------------------------------------------
    getCleanresponseById(_response_id: ID!): Cleanresponse!
    getAllCleanresponsesByRequestId(requestId: ID!): [Cleanresponse]
    #-------------------------------------------------------

    #----------------------------------------------------------
    # Funds
    #-------------------------------------------------------------
    getFund(fundId: ID!): Fund!
    getFundByPaypalId(paypalId: String!): Fund!
    getFundByAccountId(accountId: String!): Fund
    #-------------------------------------------------------------

    # Transactions
    #-------------------------------------------------------------
    getTransaction(transactionId: ID!): Transaction!
    getTransactionByPaypalId(paypalId: String!): Transaction!
    getTransactionByAccountId(accountId: String!): Transaction!
    # getAllTransactionsByAccountId(accountId: String!): [Transaction]
    # Pagination
    #-------------------------------------------------------------
    getAllTransactionsByAccountId(
      accountId: String!
      skip: Int
      limit: Int
    ): [Transaction]

    countTransactionsByAccountId(accountId: String!): Int
    # ---------------------------------------------------------

    # Notification
    # ---------------------------------------------------------
    getNotification(notificationId: ID!): Notification!
    getNotificationByPaypalId(paypalId: String!): Notification!
    getNotificationByAccountId(accountId: String!): Notification!
    # ---------------------------------------------------------
  }

  type Mutation {
    #----------------------------------------------------------
    # Cleanresponses UD
    #-------------------------------------------------------------
    createCleanresponse(input: CleanresponseInput!): Cleanresponse!
    updateCleanresponse(
      _response_id: ID!
      input: CleanresponseInput!
    ): Cleanresponse!
    deleteCleanresponse(_response_id: ID!): Cleanresponse!

    #----------------------------------------------------------
    # Languages CUD
    #-------------------------------------------------------------
    createLanguage(input: languageInput): Language!
    updateLanguage(_id: ID!, input: languageUpdateInput): Language!
    deleteLanguage(_id: ID!): Language!

    #----------------------------------------------------------
    # Customer Languages CUD
    #-------------------------------------------------------------
    createCustomerlanguage(input: customerlanguageInput): Customerlanguage!
    updateCustomerlanguage(
      _id: ID!
      input: customerlanguageUpdateInput
    ): Customerlanguage!
    deleteCustomerlanguage(_id: ID!): Customerlanguage!

    #----------------------------------------------------------
    # Clone Template
    # Template ID & Customer ID & Characters
    #----------------------------------------------------------
    cloneTemplate(
      _account_id: ID!
      _template_id: ID!
      characters: [characterInput]!
      name: String!
      description: String!
    ): Funspot!

    #----------------------------------------------------------
    # Avatars CUD
    #-------------------------------------------------------------
    createAvatar(input: avatarInput): Avatar!
    updateAvatar(_id: ID!, input: avatarUpdateInput): Avatar!
    deleteAvatar(_id: ID!): Avatar!
    #----------------------------------------------------------
    #----------------------------------------------------------
    # Customer
    #-------------------------------------------------------------
    #----------------------------------------------------------
    createCustomer(input: CustomerInput!): Customer!
    updateCustomer(customerId: ID!, input: CustomerUpdateInput!): Customer!
    deleteCustomer(customerId: ID!): Customer!

    #----------------------------------------------------------
    # Templates CUD
    #-------------------------------------------------------------
    createTemplate(input: templateInput): Template!
    updateTemplate(templateId: ID!, input: templateUpdateInput): Template!
    deleteTemplate(templateId: ID!): Template!
    #----------------------------------------------------------

    #----------------------------------------------------------
    # Funspot CUD
    #-------------------------------------------------------------
    createFunspot(input: FunspotInput!): Funspot!
    updateFunspot(funspotId: ID!, input: FunspotUpdateInput!): Funspot!
    deleteFunspot(funspotId: ID!): Funspot!

    #----------------------------------------------------------
    # Rating Microservice
    #-------------------------------------------------------------
    #----------------------------------------------------------
    ratingTemplateLogic(
      customerId: ID!
      templateId: ID!
      stars: String!
      text: String!
    ): Template!
    deleteRatingByCustomerId(templateId: ID!, customerId: ID!): Template!
    #----------------------------------------------------------

    #----------------------------------------------------------
    # Liking Microservice
    #-------------------------------------------------------------
    combinedTemplateLikingLogic(customerId: ID!, templateId: ID!): Template!
    #----------------------------------------------------------

    #----------------------------------------------------------
    # Legals CUD
    #-------------------------------------------------------------
    createLegal(title: String!, content: String!): Legal!
    updateLegal(_id: ID!, title: String!, content: String!): Legal!
    deleteLegal(_id: ID!): Legal!
    #----------------------------------------------------------

    #----------------------------------------------------------
    # Articles CUD
    #-------------------------------------------------------------
    createArticles(
      title: String!
      content: String!
      video: String!
      image: String!
    ): Articles!
    updateArticle(
      _id: ID!
      title: String!
      content: String!
      video: String!
      image: String!
    ): Articles!
    deleteArticle(_id: ID!): Articles!

    #----------------------------------------------------------
    # Requests CUD
    #-------------------------------------------------------------
    #----------------------------------------------------------
    createRequest(input: RequestInput!): Request!
    deleteRequest(_request_id: ID!): Request!
    #---------------------------------------------------------    Cleanresponse

    #----------------------------------------------------------
    # Mediate CUD
    #-------------------------------------------------------------
    mediateRequest(input: RequestInput!): Request!

    #----------------------------------------------------------
    # Responses CUD
    #-------------------------------------------------------------
    createResponse(input: ResponseInput!): Response!
    deleteResponse(_response_id: ID!): Response!
    #----------------------------------------------------------

    # Funds
    #----------------------------------------------------------
    createFund(fund: FundInput!): Fund!
    updateFund(fundId: ID!, fund: FundUpdateInput!): Fund!
    deleteFund(fundId: ID!): Fund!
    #----------------------------------------------------------

    # Transactions
    #----------------------------------------------------------
    createTransaction(transaction: TransactionInput!): Transaction!
    updateTransaction(
      transactionId: ID!
      transaction: TransactionUpdateInput!
    ): Transaction!
    deleteTransaction(transactionId: ID!): Transaction!
    #----------------------------------------------------------

    # Notifications
    # -----------------------------------------------------
    createNotification(notification: NotificationInput!): Notification!
    updateNotification(
      notificationId: ID!
      notification: NotificationUpdateInput!
    ): Notification!
    deleteNotification(notificationId: ID!): Notification!
    # -----------------------------------------------------

    # Paypal
    #----------------------------------------------------------
    # This mutation takes the customer, notification and transaction
    createUserPaypalRecords(input: createUserPaypalRecordsInput!): Customer!
    #----------------------------------------------------------
  }

  type Subscription {
    #Liking Logic
    #--------------------------------
    likingLogicChanged: Template
    #--------------------------------
    # Requests
    #--------------------------------
    requestCreated: Request
    responseCreated: Response
    #--------------------------------
    # Clean Responses
    #--------------------------------
    cleanresponseCreated: Cleanresponse
    #--------------------------------

    # Funds
    #--------------------------------
    fundCreated: Fund
    fundUpdated: Fund
    #--------------------------------
    # Transactions
    #--------------------------------
    transactionCreated: Transaction
    #--------------------------------
    # Notifications
    #--------------------------------
    notificationCreated: Notification
    notificationUpdated: Notification
    notificationDeleted:Notification
  }
`;
