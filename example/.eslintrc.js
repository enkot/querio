module.exports = {
  plugins: [
    'graphql'
  ],
  rules: {
    'graphql/template-strings': [
      'error',
      {
        env: 'literal',
        projectName: 'app',
        schemaJsonFilepath: 'node_modules/.temp/graphql/schema.json'
      }
    ]
  }
}
