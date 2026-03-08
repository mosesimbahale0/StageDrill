// R Operations
export const GET_ORDERS = `
query Orders($pageSize: Int, $after: String) {
  orders(pageSize: $pageSize, after: $after) {
    cursor
    hasMore
    orders {
      _id
      _customer_id
      product_id
      product_name
      quantity
      price
      status
      shipping_address
      payment_method
      payment_status
      delivery_date
      summary
      is_approved
      createdAt
      updatedAt
    }
  }
}
`;

export const GET_ORDER_DETAILS = `
query Query($id: ID!) {
  getOneOrder(_id: $id) {
    _id
    _customer_id
    product_id
    product_name
    quantity
    price
    status
    shipping_address
    payment_method
    payment_status
    delivery_date
    summary
    is_approved
    createdAt
    updatedAt
  }
}
`;

// CUD Operations
export const CREATE_ORDER = `
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
        _id
        _customer_id
        product_id          
        product_name  
        quantity
        price
        status
        shipping_address
        payment_method
        payment_status
        delivery_date
        summary
        is_approved
        createdAt
        updatedAt
    }
  }
`;

export const UPDATE_ORDER = `
  mutation UpdateOrder($id: ID!, $input: OrderInput!) {
    updateOrder(id: $id, input: $input) {
        _id
        _customer_id
        product_id          
        product_name  
        quantity
        price
        status
        shipping_address
        payment_method
        payment_status
        delivery_date
        summary
        is_approved
        createdAt
        updatedAt
    }
  }
`;

export const DELETE_ORDER = `
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
        _id
        _customer_id
        product_id          
        product_name  
        quantity
        price
        status
        shipping_address
        payment_method
        payment_status
        delivery_date
        summary
        is_approved
        createdAt
        updatedAt
    }
  }
`;

// Cancel Order
export const CANCEL_ORDER = `
  mutation CancelOrder($id: ID!) {
    cancelOrder(id: $id) {
        _id
        status
        updatedAt
    }
  }
`;
