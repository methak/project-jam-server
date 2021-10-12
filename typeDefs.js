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
        lontitude: Float
        shopper : User
        items: [Item]
    }

    type Item {
        text: String
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
        createItem(storeId: ID!, text: String!): Store
      }
    
      type Subscription {
        storeAdded: Store
        storeDeleted: Store
        storeUpdated: Store
      }
`