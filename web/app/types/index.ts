export interface Product {
  _id: string;
  product_name: string;
  product_description: string;
  product_cover: string;
  product_images?: string[];
  product_video?: string;
  auction_end: string;
  current_bid: number;
  min_bid_increment: number;
  bidders_count: number;
  seller: string;
  likes: number;
  views: number;
  tags?: string[];
  bidHistory: Bid[];
}

export interface Merchant {
  _id: string;
  user_name: string;
  profile_picture?: string;
}

export interface Bid {
  _id: string;
  customer: {
    _id: string;
    user_name: string;
    profile_picture?: string;
  };
  bid_amount: number;
  bid_time: string;
}

export interface Chat {
  _id: string;
  customer: {
    _id: string;
    user_name: string;
  };
  content: string;
  createdAt: string;
}
