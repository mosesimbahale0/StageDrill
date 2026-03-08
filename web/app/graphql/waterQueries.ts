// R Operations
export const WATERS_QUERY = `
  query GetWaters($after: String, $pageSize: Int) {
    waters(after: $after, pageSize: $pageSize) {
      cursor
      hasMore
      waters {
        _id
        water_name
        water_description
        water_cover
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
  }
`;

export const WATER_DETAILS_QUERY = `
  query GetWaterById($id: ID!) {
    waters(id: $id) {     
      waters {             
        _id
        water_name
        water_description
        water_cover       
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
  }
`;

// CUD Operations
export const CREATE_WATER = `
  mutation CreateWater($input: WaterInput!) {
    createWater(input: $input) {
        _id     
        water_name
        water_description
        water_cover  
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

export const UPDATE_WATER = `
  mutation UpdateWater($id: ID!, $input: WaterInput!) {
    updateWater(id: $id, input: $input) {
        _id     
        water_name
        water_description
        water_cover  
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

export const DELETE_WATER = `
  mutation DeleteWater($id: ID!) {
    deleteWater(id: $id) {
        _id
    }
  }
`;
