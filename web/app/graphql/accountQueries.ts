// --- GraphQL Queries ---
export const GET_PRODUCTS_BY_SELLER_QUERY = `
  query ProductsBySeller($seller: String!) {
    productsBySeller(seller: $seller) {
      _id
      product_name
      product_cover
      current_bid
      auction_end
      is_sold
      category
    }
  }
`;

export const GET_MERCHANT_BY_PHONE = `
query CustomerByPhoneNumber($phoneNumber: String!) {
  customerByPhoneNumber(phone_number: $phoneNumber) {
    _id
    _kyc_id
    _uid
    user_name
    average_rating
    cover_photo
    phone_number
    pinterest
    profile_picture
    permanent_address
    linkedin
    likes
    kyc_verified
    is_verified
    is_moderated
    is_blocked
    is_active
    instagram
    facebook
    createdAt
    bio
    review_count
  }
}
`;