import { createApp } from 'vue'
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client/core'
import { createUploadLink } from 'apollo-upload-client'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { BatchHttpLink } from '@apollo/client/link/batch-http'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import App from './App.vue'

// HTTP connection to the API
const opts = {
  uri: 'http://localhost:3000/graphql',
  // useGETForQueries: true,
}

const httpLink = ApolloLink.split(
  operation => operation.getContext().hasUpload,
  createUploadLink(opts),
  new HttpLink(opts),
  // new BatchHttpLink(opts),
)

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
})

const app = createApp(App)

app.provide(DefaultApolloClient, apolloClient)
app.mount('#app')
