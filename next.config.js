module.exports = {
  // target: 'serverless',
  env: {
    BASE_URL: '/',
    HASURA_BROWSER_URL: process.env.HASURA_BROWSER_URL || 'https://serene-sea-87604.herokuapp.com/v1/graphql',
    HASURA_WS_URL: process.env.HASURA_WS_URL || 'wss://serene-sea-87604.herokuapp.com/v1/graphql',
    HASURA_SSR_URL: process.env.HASURA_SSR_URL || 'https://serene-sea-87604.herokuapp.com/v1/graphql',
  },
  //assetPrefix: '/function/<your-function-name>'
}