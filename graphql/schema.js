const { gql } = require('apollo-server-express');

const typeDefs = gql`

  scalar Date

  type User {
    id: Int!
    usersEmail: String!
    usersRole: String!
  }

  type Blog {
    id: Int!
    blogTitle: String!
    blogContent: String!
    blogStatus: String!
    blogPublishDate: Date!
    author: User! # Nested field to fetch the user who wrote the blog
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  # --- INPUTS (For Mutations) ---
  input RegisterInput {
    usersEmail: String!
    usersPassword: String!
    usersRole: String
  }

  input LoginInput {
    usersEmail: String!
    usersPassword: String!
  }
  
  input AddBlogInput {
    blogTitle: String!
    blogAuthor: String
    blogContent: String!
    blogStatus: String
  }
  
  input EditBlogInput {
    blogTitle: String
    blogContent: String
    blogStatus: String
  }

  # --- QUERIES (Read Operations) ---
  type Query {
    "Fetches all blogs with authors"
    blogs: [Blog!]!
    "Fetches a single blog by its ID"
    blog(id: Int!): Blog
  }

  # --- MUTATIONS (Write Operations) ---
  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
    addBlog(input: AddBlogInput!): Blog!
    editBlog(id: Int!, input: EditBlogInput!): Blog!
    deleteBlog(id: Int!): String!
  }
`;

module.exports = typeDefs;