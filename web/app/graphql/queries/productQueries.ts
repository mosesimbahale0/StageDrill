export const GET_PRODUCT_DETAILS_QUERY = `
  query GetProduct($productId: String!) {
    product(id: $productId) {
      _id
      product_name
      product_description
      product_cover
      product_images
      product_video
      auction_end
      current_bid
      min_bid_increment
      bidders_count
      seller
      likes
      views
      tags
      bidHistory {
        _id
        customer {
          _id
          user_name
          profile_picture
        }
        bid_amount
        bid_time
      }
    }
  }
`;

export const GET_CHAT_BY_PRODUCT_QUERY = `
  query GetChatsByProduct($productId: String!) {
    chatsByProduct(productId: $productId) {
      _id
      customer {
        _id
        user_name
      }
      content
      createdAt
    }
  }
`;

export const GET_MERCHANT_BY_PHONE_FROM_PRODUCT_SELLER_FIELD_QUERY = `
  query GetMerchantByPhone($phoneNumber: String!) {
    customerByPhoneNumber(phoneNumber: $phoneNumber) {
      _id
      user_name
      profile_picture
    }
  }
`;

export const GET_CUSTOMER_ID_BY_PHONE_NUMBER_FROM_GET_CUSTOMER_ID_WHICH_RETURNS_PHONE_QUERY = `
  query GetCustomerIdByPhone($phoneNumber: String!) {
    customerByPhoneNumber(phoneNumber: $phoneNumber) {
      _id
    }
  }
`;

export const GET_SIMILAR_PRODUCTS_QUERY = `
  query GetSimilarProducts($productId: String!) {
    productsBySimilar(productId: $productId) {
      _id
      product_name
      product_cover
      current_bid
    }
  }
`;
