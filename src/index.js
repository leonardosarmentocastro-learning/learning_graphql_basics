import { GraphQLServer } from 'graphql-yoga';

// Scalar types (primitive types) - String, Boolean, Int, Float
// Non scalar types (reference types) - Objects and Arrays

const users = [{
  id: '11',
  name: 'Leonardo',
  email: 'leonardo@mail.com',
}, {
  id: '22',
  name: 'Rafael',
  email: 'rafael@mail.com',
}, {
  id: '33',
  name: 'Diogo',
  email: 'diogo@mail.com',
}];

const posts = [{
  id: '1',
  title: 'i love video games',
  body: 'looking forward to play Sekiro',
  isPublished: true,
  author: { id: '11' }
}, {
  id: '2',
  title: 'a post about potatoes',
  body: 'and that is it',
  isPublished: false,
  author: { id: '11' }
}, {
  id: '3',
  title: 'Tyler 1',
  body: 'is good ok',
  isPublished: true,
  author: { id: '22' }
}];

const comments = [{
  id: '999',
  text: 'beautiful flowers',
  author: { id: '33' },
}, {
  id: '888',
  text: 'hory shet',
  author: { id: '33' },
}, {
  id: '777',
  text: 'felling hungry',
  author: { id: '22' },
}];

const typeDefs = `
  type Query {
    comments(query: String): [Comment!]!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    isPublished: Boolean!
    author: User!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
  }
`;

const resolvers = {
  Query: {
    comments: (parent, args, context, info) => {
      const { query } = args;
      if (!query) return comments;

      const normalize = (string) => string.toLowerCase().trim();
      const normalizedQuery = normalize(query);

      return comments.filter(comment => {
        const { id, text } = comment;
        return [ id, text ]
          .map(value => normalize(value))
          .some(normalizedValue => normalizedValue.includes(normalizedQuery));
      });
    },
    users: (parent, args, context, info) => {
      console.log('### Query > users resolver');

      const { query } = args;
      if (!query) return users;

      return users.filter(user =>
        user.name.toLowerCase()
          .includes(query.toLowerCase())
      );
    },
    posts: (parent, args, context, info) => {
      const { query } = args;
      if (!query) return posts;

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
  },
  Post: {
    author(parent, args, context, info) {
      const post = parent;
      return users.find(user => user.id === post.author.id);
    }
  },
  User: {
    // you need to refine a resolver for each field that is note a "scalar type" field
    posts(parent, args, context, info) {
      const user = parent;
      return posts.filter(post => post.author.id === user.id);
    },
    comments(user, args, context, info) {
      console.log('### User > comments resolver', user);
      return comments.filter(comment => comment.author.id === user.id);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('# server is running!');
});
