import { GraphQLServer } from 'graphql-yoga';

// Scalar types (primitive types) - String, Boolean, Int, Float
// Non scalar types (reference types) - Objects and Arrays

const users = [{
  id: '1',
  name: 'Leonardo',
  email: 'leonardo@mail.com',
}, {
  id: '2',
  name: 'Rafael',
  email: 'rafael@mail.com',
}, {
  id: '3',
  name: 'Diogo',
  email: 'diogo@mail.com',
}];

const posts = [{
  id: '1',
  title: 'i love video games',
  body: 'looking forward to play Sekiro',
  isPublished: true,
}, {
  id: '2',
  title: 'a post about potatoes',
  body: 'and that is it',
  isPublished: false,
}, {
  id: '3',
  title: 'Tyler 1',
  body: 'is good ok',
  isPublished: true,
}];

const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    isPublished: Boolean!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }
`;

const resolvers = {
  Query: {
    users: (parent, args, context, info) => {
      const { query } = args;
      if (!query) return users;

      return users.filter(user =>
        user.name.toLowerCase()
          .includes(query.toLowerCase())
      );
    },
    posts: (parent, args, context, info) => {
      const { query } = args;
      const hasQuery = !!query;
      if (!hasQuery) return posts;

      const format = string => string.toLowerCase().trim();
      const formattedQuery = format(query);

      return posts.filter(post => {
        const { title, body } = post;

        return [ title, body ]
          .map(field => format(field))
          .some(formattedField => formattedField.includes(formattedQuery));
      });
    },
    me: () => ({
      id: 123,
      name: 'Leonardo',
      email: 'email@domain.com'
    }),
    post: () => ({
      id: 123,
      title: "Caguei",
      body: "Na sua mão",
      isPublished: true
    })
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('# server is running!');
});
