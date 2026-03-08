export const CREATE_BID_MUTATION = `
  mutation CreateBid($input: BidInput!) {
    createBid(input: $input) {
      _id
      customer {
        _id
        user_name
      }
      bid_amount
      bid_time
    }
  }
`;

export const CREATE_CHAT_MUTATION = `
  mutation CreateChat($productId: String!, $customerId: String!, $content: String!) {
    createChat(productId: $productId, customerId: $customerId, content: $content) {
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

export const DELETE_CHAT_MUTATION = `
  mutation DeleteChat($chatId: String!) {
    deleteChat(chatId: $chatId)
  }
`;

export const LIKE_PRODUCT_MUTATION = `
  mutation LikeProduct($productId: String!, $customerId: String!) {
    likeProduct(productId: $productId, customerId: $customerId) {
      likes
    }
  }
`;

export const UNLIKE_PRODUCT_MUTATION = `
  mutation UnlikeProduct($productId: String!, $customerId: String!) {
    unlikeProduct(productId: $productId, customerId: $customerId) {
      likes
    }
  }
`;
