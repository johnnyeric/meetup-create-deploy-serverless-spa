import { ApolloProvider } from '@apollo/react-hooks';
import { renderToString } from 'react-dom/server';
import Head from 'next/head';
import React, { useMemo } from 'react';
import initGraphQLClient from './initGraphQLClient';

export default function withGraphQL(PageComponent, { ssr = true } = {}) {
  const WithGraphQL = ({ graphQLClient, graphQLState, ...pageProps }) => {
    const client = useMemo(
      () => graphQLClient || initGraphQLClient(graphQLState),
      [graphQLClient, graphQLState],
    );
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = PageComponent.displayName || PageComponent.name || 'Component';

    if (displayName === 'App') {
      console.warn('This withGraphQL HOC only works with PageComponents.');
    }

    WithGraphQL.displayName = `withGraphQL(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithGraphQL.getInitialProps = async (ctx) => {
      const { Component } = ctx;
      const router = {
        pathname: ctx.pathname,
        query: ctx.query,
      };

      // Initialize GraphQLClient, add it to the ctx object so
      // we can use it in `PageComponent.getInitialProp`.
      ctx.graphQLClient = initGraphQLClient();

      const { graphQLClient } = ctx;

      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getMarkupFromTree } = await import('@apollo/react-ssr');
            const tree = (
              <ApolloProvider client={graphQLClient}>
                <PageComponent
                  {...pageProps}
                  Component={Component}
                  router={router}
                  graphQLClient={graphQLClient}
                />
              </ApolloProvider>
            );
            await getMarkupFromTree({
              tree,
              renderFunction: renderToString,
            });
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getMarkupFromTree`', error);
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind();
        }
      }

      // Extract query data from the Apollo store
      const graphQLState = graphQLClient.cache.extract();

      return {
        ...pageProps,
        graphQLState,
      };
    };
  }

  return WithGraphQL;
}

// https://github.com/zeit/next.js/blob/canary/examples/with-apollo/lib/apollo.js
// https://github.com/apollographql/react-apollo/issues/3251