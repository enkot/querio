<script setup lang="ts">
import { useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { ofetch } from 'ofetch'

const apiFetch = ofetch.create({ baseURL: 'http://localhost:3000' })
const client = useApolloClient()

async function gqlQueryBook() {
  const result = await client.client.query({
    query: gql`
      query BookQuery($id: ID!) {
        book(id: $id) {
          id
          title
          author
        }
      }
    `,
    variables: {
      id: '1',
    },
  })
}

async function gqlQueryAuthor() {
  const result = await client.client.query({
    query: gql`
      query AuthorQuery($id: ID!) {
        author(id: $id) {
          id
          name
        }
      }
    `,
    variables: {
      id: '1',
    },
  })
}

async function gqlQueryBatch() {
  return Promise.all([
    gqlQueryBook(),
    gqlQueryAuthor(),
  ])
}

async function gqlMutationAddBook() {
  const result = await client.client.mutate({
    mutation: gql`
      mutation BookMutation($title: String!, $author: String!) {
        addBook(title: $title, author: $author) {
          id
          title
          author
        }
      }
    `,
    variables: {
      title: 'Test1',
      author: 'Test2',
    },
  })
}

async function post() {
  const body = { test: 'true' }

  const result = await apiFetch('/user', {
    method: 'POST',
    query: {
      title: 'Test1',
    },
    body,
  })
}

async function get() {
  const result = await apiFetch('/user', {
    method: 'GET',
    query: {
      title: 'Test1',
    },
  })
}
</script>

<template>
  <div class="bg-gray-900 min-h-screen flex flex-col items-center justify-center space-y-10">
    <div class="text-7xl text-white">
      <h1>Querio Playground</h1>
    </div>
    <div class="flex gap-4">
      <button class="btn" type="button" @click="get">
        GET
      </button>
      <button class="btn" type="button" @click="post">
        POST
      </button>
      <button class="btn" type="button" @click="gqlQueryBook">
        GQL Query
      </button>
      <button class="btn" type="button" @click="gqlMutationAddBook">
        GQL Mutation
      </button>
      <button class="btn" type="button" @click="gqlQueryBatch">
        GQL Batch Query
      </button>
    </div>
  </div>
</template>
