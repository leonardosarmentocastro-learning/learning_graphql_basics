import { GraphQLServer } from 'graphql-yoga';

// Scalar types (primitive types) - String, Boolean, Int, Float
// Non scalar types (reference types) - Objects and Arrays

const typeDefs = `
  type Query {
    add(numbers: [Float!]!): Float!
    greeting(name: String!, position: String!): String!
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
    add: (parent, args, context, info) => {
      const { numbers } = args;
      if (!numbers.length) return 0;

      return numbers.reduce((accumulator, currentValue) => accumulator + currentValue);
    },
    greeting: (parent, args, context, info) => {
      const { name, position } = args;
      if (name && position) {
        return `Hello ${name}, you are my favorite ${position}!`;
      }

      return 'Hello!';
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
