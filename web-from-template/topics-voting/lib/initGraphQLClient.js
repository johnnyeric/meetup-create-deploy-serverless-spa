import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import unfetch from 'isomorphic-unfetch';
import ws from 'ws';

let graphQLClient = null;

const create = (initialState) => {
  const IS_SERVER = typeof window === 'undefined';
  const API_URL = !IS_SERVER
    ? process.env.HASURA_BROWSER_URL
    : process.env.HASURA_SSR_URL;

  const headers = {
    'Content-Type': 'application/json',
  };

  const httpLink = createHttpLink({
    uri: API_URL,
    headers,
    fetch: !IS_SERVER && unfetch,
  });

  const wsLink = new WebSocketLink({
    uri: process.env.HASURA_WS_URL,
    options: {
      reconnect: true,
      lazy: true,
    },
    webSocketImpl: IS_SERVER ? ws : window.WebSocket,
  });

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  );

  return new ApolloClient({
    connectToDevTools: !IS_SERVER,
    ssrMode: IS_SERVER,
    link,
    cache: new InMemoryCache().restore(initialState || {}),
  });
};

export default (initialState) => {
  if (typeof window === 'undefined') {
    return create(initialState);
  }
  if (!graphQLClient) {
    graphQLClient = create(initialState);
  }

  return graphQLClient;
};
