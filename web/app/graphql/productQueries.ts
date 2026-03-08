// export const GET_PRODUCTS = `
// query Query($pageSize: Int, $after: String) {
//   products(pageSize: $pageSize, after: $after) {
//     cursor
//     hasMore
//     products {
//       _id
//       product_name
//       product_description
//       product_cover
//       product_images
//       price
//       is_in_stock
//       quantity
//       tags
//       category
//       views
//       likes
//       createdAt
//       updatedAt
//     }
//   }
// }
// `;

// export const GET_PRODUCT_DETAILS = `
//   query GetProductById($id: ID!) {
//     product(id: $id) {
//         _id
//         product_name
//         product_description
//         product_cover
//         product_images
//         price
//         is_in_stock
//         quantity
//         tags
//         category
//         views
//         likes
//         createdAt
//         updatedAt
//     }
//   }
// `;

// // CUD Operations
// export const CREATE_PRODUCT = `
//   mutation CreateProduct($input: ProductInput!) {
//     createProduct(input: $input) {
//         _id
//         product_name
//         product_description
//         product_cover
//         product_images
//         price
//         is_in_stock
//         quantity
//         tags
//         category
//         views
//         likes
//         createdAt
//         updatedAt
//     }
//   }
// `;

// export const UPDATE_PRODUCT = `
//   mutation UpdateProduct($id: ID!, $input: ProductInput!) {
//     updateProduct(id: $id, input: $input) {
//         _id
//         product_name
//         product_description
//         product_cover
//         product_images
//         price
//         is_in_stock
//         quantity
//         tags
//         category
//         views
//         likes
//         createdAt
//         updatedAt
//     }
//   }
// `;

// export const DELETE_PRODUCT = `
//   mutation DeleteProduct($id: ID!) {
//     deleteProduct(id: $id) {
//         _id
//         product_name
//         product_description
//         product_cover
//         product_images
//         price
//         is_in_stock
//         quantity
//         tags
//         category
//         views
//         likes
//         createdAt
//         updatedAt
//     }
//   }
// `;

// export const GET_PRODUCT_DETAILS_QUERY = `
// query Product($productId: ID!) {
//   product(id: $productId) {
//     _id
//     auction_end
//     auction_start
//     bidHistory {
//       _id
//     }
//     bidders {
//       _id
//     }
//     bidders_count
//     buyer
//     category
//     createdAt
//     current_bid
//     display_location
//     is_active
//     is_moderated
//     is_sold
//     is_verified
//     likes
//     min_bid_increment
//     must_win_bid
//     product_cover
//     product_description
//     product_images
//     product_name
//     product_video
//     seller
//     sold_price
//     start_bid
//     tags
//     updatedAt
//     views
//     likedBy {
//       _id
//     }
//   }
// }
// `;

// export const GET_CUSTOMER_ID_BY_PHONE_NUMBER_FROM_GET_CUSTOMER_ID_WHICH_RETURNS_PHONE_QUERY = `
// query CustomerByPhoneNumber($phoneNumber: String!) {
//   customerByPhoneNumber(phone_number: $phoneNumber) {
//     _id
//     _uid
//     likes
//     liking_history {
//       _id
//     }
//   }
// }
// `;

// export const TOGGLE_LIKE_MUTATION = `
//   mutation ToggleLikeProduct($productId: ID!, $customerId: ID!) {
//   toggleLikeProduct(productId: $productId, customerId: $customerId) {
//     _id
//     likes
//   }
// }
// `;

// export const GET_MERCHANT_BY_PHONE_FROM_PRODUCT_SELLER_FIELD_QUERY = `
//   query CustomerByPhoneNumber($phoneNumber: String!) { customerByPhoneNumber(phone_number: $phoneNumber) { _id, user_name, profile_picture, phone_number } }
// `;

// export const GET_SIMILAR_PRODUCTS_QUERY = `
//   query ProductsBySimilar($productId: ID!) { productsBySimilar(productId: $productId) { _id, product_name, product_cover, current_bid } }
// `;
// export const CREATE_BID_MUTATION = `
//   mutation CreateBid($input: BidInput!) { createBid(input: $input) { _id, bid_amount, bid_time } }
// `;
// export const CREATE_CHAT_MUTATION = `
//   mutation CreateChat($productId: ID!, $customerId: ID!, $content: String!) { createChat(productId: $productId, customerId: $customerId, content: $content) { _id, content, createdAt, customer { _id, user_name } } }
// `;
// export const DELETE_CHAT_MUTATION = `
//   mutation DeleteChat($chatId: ID!) { deleteChat(chatId: $chatId) { _id } }
// `;
// export const GET_CHAT_BY_PRODUCT_QUERY = `
//   query ChatsByProduct($productId: ID!) { chatsByProduct(productId: $productId) { _id, content, createdAt, customer { _id, user_name } } }
// `;
// export const LIKE_PRODUCT_MUTATION = `
//   mutation LikeProduct($productId: ID!, $customerId: ID!) { likeProduct(productId: $productId, customerId: $customerId) { likes } }
// `;
// export const UNLIKE_PRODUCT_MUTATION = `
//   mutation UnlikeProduct($productId: ID!, $customerId: ID!) { unlikeProduct(productId: $productId, customerId: $customerId) { likes } }
// `;

// export const GET_REVIEWS_BY_MERCHANT_PHONE_QUERY = `
//   query ReviewsForCustomer($customerId: ID!) {
//   reviewsForCustomer(customerId: $customerId) {
//     _id
//     comment
//     rating
//     reviewed_by {
//       _id
//       user_name
//       average_rating
//     }
//   }
// }
//   `;

// export const CREATE_REVIEW_MUTATION = `
//   mutation Mutation($input: ReviewInput!) {
//   createReview(input: $input) {
//     _id
//     customer {
//       _id
//     }
//     rating
//     comment
//     reviewed_by {
//       _id
//     }
//     createdAt
//     updatedAt
//   }
// }
//   `;

// ===============================
// Product Queries (CRUD)
// ===============================

export const GET_PRODUCTS = `
query Query($pageSize: Int, $after: String) {
  products(pageSize: $pageSize, after: $after) {
    cursor
    hasMore
    products {
      _id
      product_name
      product_description
      product_cover
      product_images
      price
      is_in_stock
      quantity
      tags
      category
      views
      likes
      createdAt
      updatedAt
      bidHistory { 
      _id
      bid_amount
      bid_time
      customer { 
        _id
        user_name
        profile_picture
      }
    }
    }
  }
}
`;

export const GET_PRODUCT_DETAILS = `
query Product($productId: ID!) {
  product(id: $productId) {
    _id
    auction_end
    auction_start

    bidHistory { 
      _id
      bid_amount
      bid_time
      customer {
        _id
        user_name
        profile_picture
      }
    }


    bidders {
      _id
    }
    bidders_count
    buyer
    category
    createdAt
    current_bid
    display_location
    is_active
    is_moderated
    is_sold
    is_verified
    likes
    min_bid_increment
    must_win_bid
    product_cover
    product_description
    product_images
    product_name
    product_video
    seller
    sold_price
    start_bid
    tags
    updatedAt
    views
    likedBy {
      _id
    }
  }
}
`;

export const CREATE_PRODUCT = `
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
        _id
        product_name
        product_description
        product_cover
        product_images  
        price
        is_in_stock
        quantity
        tags
        category
        views
        likes
        createdAt
        updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = `
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
        _id
        product_name
        product_description
        product_cover
        product_images  
        price
        is_in_stock
        quantity
        tags
        category
        views
        likes
        createdAt
        updatedAt
    }
  }
`;

export const DELETE_PRODUCT = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
        _id
        product_name
        product_description
        product_cover
        product_images  
        price
        is_in_stock
        quantity
        tags
        category
        views
        likes
        createdAt
        updatedAt
    }
  }
`;

// ===============================
// Product Page Specific Queries
// ===============================

export const GET_PRODUCT_DETAILS_QUERY = `
query Product($productId: ID!) {
  product(id: $productId) {
    _id
    auction_end
    auction_start
    bidHistory { 
      _id
      bid_amount
      bid_time
      customer {
        _id
        user_name
        profile_picture
      }
    }
    bidders {
      _id
    }
    bidders_count
    buyer
    category
    createdAt
    current_bid
    display_location
    is_active
    is_moderated
    is_sold
    is_verified
    likes
    min_bid_increment
    must_win_bid
    product_cover
    product_description
    product_images
    product_name
    product_video
    seller
    sold_price
    start_bid
    tags
    updatedAt
    views
    likedBy {
      _id
    }
  }
}
`;

export const GET_CUSTOMER_ID_BY_PHONE_NUMBER_FROM_GET_CUSTOMER_ID_WHICH_RETURNS_PHONE_QUERY = `
query CustomerByPhoneNumber($phoneNumber: String!) {
  customerByPhoneNumber(phone_number: $phoneNumber) {
    _id,
    _uid,
    likes,
          profile_picture, 
          phone_number, 
    liking_history {
      _id
    }
  }
}
`;

export const GET_MERCHANT_BY_PHONE_FROM_PRODUCT_SELLER_FIELD_QUERY = `
  query CustomerByPhoneNumber($phoneNumber: String!) { 
    customerByPhoneNumber(phone_number: $phoneNumber) { 
      _id, 
      user_name, 
      profile_picture, 
      phone_number 
    } 
  }
`;

export const GET_SIMILAR_PRODUCTS_QUERY = `
  query ProductsBySimilar($productId: ID!) { 
    productsBySimilar(productId: $productId) { 
      _id, 
      product_name, 
      product_cover, 
      current_bid, 
      bidders_count
    } 
  }
`;

// ===============================
// Like / Bid / Chat Mutations
// ===============================

export const TOGGLE_LIKE_MUTATION = `
mutation ToggleLikeProduct($productId: ID!, $customerId: ID!) {
  toggleLikeProduct(productId: $productId, customerId: $customerId) {
    _id
    likes
  }
}
`;

// These are deprecated by TOGGLE_LIKE_MUTATION but included from your list
export const LIKE_PRODUCT_MUTATION = `
  mutation LikeProduct($productId: ID!, $customerId: ID!) { 
    likeProduct(productId: $productId, customerId: $customerId) { likes } 
  }
`;

export const UNLIKE_PRODUCT_MUTATION = `
  mutation UnlikeProduct($productId: ID!, $customerId: ID!) { 
    unlikeProduct(productId: $productId, customerId: $customerId) { likes } 
  }
`;

export const CREATE_BID_MUTATION = `
  mutation CreateBid($input: BidInput!) { 
    createBid(input: $input) { 
      _id, 
      bid_amount, 
      bid_time 
    } 
  }
`;

export const CREATE_CHAT_MUTATION = `
  mutation CreateChat($productId: ID!, $customerId: ID!, $content: String!) { 
    createChat(productId: $productId, customerId: $customerId, content: $content) { 
      _id, 
      content, 
      createdAt, 
      customer { _id, user_name } 
    } 
  }
`;

export const DELETE_CHAT_MUTATION = `
  mutation DeleteChat($chatId: ID!) { 
    deleteChat(chatId: $chatId) { _id } 
  }
`;

export const GET_CHAT_BY_PRODUCT_QUERY = `
  query ChatsByProduct($productId: ID!) { 
    chatsByProduct(productId: $productId) { 
      _id, 
      content, 
      createdAt, 
      customer { _id, user_name } 
    } 
  }
`;

// ===============================
// Review Queries
// ===============================

export const GET_REVIEWS_BY_MERCHANT_PHONE_QUERY = `
  query ReviewsForCustomer($customerId: ID!) {
    reviewsForCustomer(customerId: $customerId) {
      _id
      comment
      rating
      reviewed_by {
        _id
        user_name
        average_rating
      }
    }
  }
`;

export const CREATE_REVIEW_MUTATION = `
  mutation Mutation($input: ReviewInput!) {
    createReview(input: $input) {
      _id
      customer {
        _id
      }
      rating
      comment
      reviewed_by {
        _id
      }
      createdAt
      updatedAt
    }
  }
`;
