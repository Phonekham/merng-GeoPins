const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
  }

  type Comment {
    _id: ID
    author: User
    text: String
    createdAt: String
  }

  type Pin {
    _id: ID
    createdAt: String
    title: String
    content: String
    image: String
    latitude: Float
    longitude: Float
    author: User
    comments: [Comment]
  }

  input createPinInput {
    title: String
    image: String
    content: String
    latitude: Float
    longitude: Float
  }

  type Query {
    me: User
    getPins: [Pin!]
  }

  type Mutation {
    createPin(input: createPinInput!): Pin
  }
`;
