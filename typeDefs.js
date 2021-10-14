const { gql } = require('apollo-server')

module.exports = gql`
    type User {
        _id: ID
        name: String
        email: String
        picture: String
    
    }

    type Store {
        _id: ID
        createdAt: String
        title: String
        content: String
        image: String
        latitude : Float
        longitude: Float
        shopper : User
        items: [Item]
    }

    type Item {
        _id: ID
        name: String
        quantity: Int
        isBought: Boolean
        createdAt: String
        shopper: User
    }

    input createStoreInput {
        title: String
        image: String
        content: String
        latitude: Float
        longitude: Float
      }

    type Query {
        me : User
        getStores: [Store!]
    }

    type Mutation {
        createStore(input: createStoreInput!): Store
        deleteStore(storeId: ID!): Store
        createItem(storeId: ID!, name: String!): Store
        deleteItem(storeId: ID!, itemId: ID!): Store
        updateItem(storeId: ID!, itemId: ID!, quantity: Int!, isBought: Boolean!): Store
    }
      type Subscription {
        storeAdded: Store
        storeDeleted: Store
        storeUpdated: Store
      }
`