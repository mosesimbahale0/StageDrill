export const GET_ALL_COUNTRIES = `
  query GetAllCountries {
    getAllCountries {
      _id
      name
      code
      emoji
    }
  }
`;

export const GET_ALL_CUSTOMER_LANGUAGES = `
  query GetAllCustomerLanguages {
    getAllCustomerLanguages {
      _id
      name
      language_code
    }
  }
`;

export const CREATE_USER = `
  mutation Mutation($input: CustomerInput!) {
    createCustomer(input: $input) {
      sex
      updatedAt
      profession
      phone
      name
      location
      language_code
      language
      createdAt
      bday
      _uid
      _id
    }
  }
`;

export const GET_ALL_TRANSACTIONS_BY_ACCOUNT_ID = `
  query GetAllTransactionsByAccountId(
    $accountId: String!
    $skip: Int
    $limit: Int
  ) {
    getAllTransactionsByAccountId(
      accountId: $accountId
      skip: $skip
      limit: $limit
    ) {
      _id
      _account_id
      _paypal_id
      _paypal_transaction_id
      transaction_status
      createdAt
      updatedAt
    }
    totalTransactions: countTransactionsByAccountId(accountId: $accountId)
  }
`;
