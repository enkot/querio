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

async function gqlQueryReview() {
  const result = await client.client.query({
    query: gql`
      query ReviewQuery($id: ID!) {
        review(id: $id) {
          id
          message
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
    gqlQueryReview(),
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

async function html() {
  const result = await apiFetch('/html', {
    method: 'GET',
  })
}

async function xml() {
  const result = await apiFetch('/xml', {
    method: 'GET',
  })
}

async function error() {
  const result = await apiFetch('/error', {
    method: 'GET',
  })
}

async function multipart() {
  const body = new FormData()

  // body.append('image', image)
  body.append('title', 'Marvel')
  body.append('content', 'Endgame')

  const result = await apiFetch('/user', {
    method: 'POST',
    body,
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-900 space-y-10">
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
      <button class="btn" type="button" @click="multipart">
        Multipart
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
      <button class="btn" type="button" @click="html">
        HTML
      </button>
      <button class="btn" type="button" @click="xml">
        XML
      </button>
      <button class="btn" type="button" @click="error">
        Error
      </button>
    </div>
  </div>
</template>
