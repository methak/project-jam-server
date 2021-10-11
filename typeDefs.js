const { gql } = require('apollo-server')

module.exports = gql`
    type User {
        _id: ID
        name: String
        email: String
        picture: String
    
    }

    type Pin {
        _id: ID
        createdAt: String
        content: String
        image: String
        latitude : Float
        lontitude: Float
        author : User
        comments: [Comment]
    }

    type Comment {
        text: String
        createdAt: String
        author: User
    }

    type Query {
        me : User
    }
`