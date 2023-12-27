import { createServer } from 'node:http'
import { createApp, eventHandler, handleCors, sendError, setCookie, toNodeListener } from 'h3'
import { ApolloServer } from '@apollo/server'
import { startServerAndCreateH3Handler } from '@as-integrations/h3'

const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String
  }

  type Book {
    id: ID!
    title: String
    author: String
  }

  type Review {
    id: ID!
    message: String
  }
  
  type Query {
    author(id: ID!): Author
    authors: [Author]
    book(id: ID!): Book
    books: [Book]
    review(id: ID!): Review
    reviews: [Review]
  }

  type Mutation {
    addBook(title: String!, author: String!): Book
    # singleUpload(file: Upload!): UploadedFileResponse!
  }
`

const authors = [
  {
    id: '1',
    name: 'Stephen King',
  },
  {
    id: '2',
    name: 'Paul Auster',
  },
]

const books = [
  {
    id: '1',
    title: 'The Awakening',
    authorId: '1',
  },
  {
    id: '2',
    title: 'City of Glass',
    authorId: '2',
  },
]

const reviews = [
  {
    id: '1',
    message: 'I love this book!',
  },
  {
    id: '2',
    message: 'I hate this book!',
  },
]

const resolvers = {
  Query: {
    author: (_, args) => authors.find(author => author.id === args.id),
    authors: () => authors,
    book: (_, args) => books.find(book => book.id === args.id), // new Error('Test error'),
    books: () => books,
    review: (_, args) => reviews.find(review => review.id === args.id),
    reviews: () => reviews,
  },
  Mutation: {
    addBook: (_, args) => {
      return {
        id: '3',
        title: args.title,
        author: args.author,
      }
    },
    // singleUpload: async (_, { file }) => {
    //   const { filename, mimetype, encoding } = await file

    //   return { filename, mimetype, encoding }
    // },
  },
}

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  allowBatchedHttpRequests: true,
})

const app = createApp()

app.use(eventHandler((event) => {
  handleCors(event, {})
}))
app.use(
  '/graphql',
  startServerAndCreateH3Handler(apollo),
)
app.use(
  '/user',
  eventHandler(async (event) => {
    setCookie(event, 'testcookie', 'testvalue', {
      sameSite: 'none',
      secure: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    })

    // await new Promise((resolve) => {
    //   setTimeout(resolve, 10000)
    // })

    return {
      test: 12,
    }
  }),
)
app.use('/html', eventHandler(() => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>  
`))
app.use('/xml', eventHandler(() => `
<book>
  <id>1</id>
  <title>string</title>
  <author>string</author>
</book>
`))
app.use('/string', eventHandler(() => 'Hello world!'))
app.use('/error', eventHandler(event => sendError(event, new Error('Test error'))))

createServer(toNodeListener(app)).listen(process.env.PORT || 3000)
