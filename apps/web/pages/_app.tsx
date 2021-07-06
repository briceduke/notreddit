import { AppProps } from 'next/app';
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import { cacheExchange, Cache, QueryInput } from "@urql/exchange-graphcache";
import Head from 'next/head';

import '../styles/globals.css'

import { LoginMutation, MeDocument, MeQuery, RegisterMutation, RegisterMutationVariables } from '../generated/graphql';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cache.updateQuery(qi, data => fn(result, data as any) as any)
}

const client = createClient({
  url: 'http://localhost:4000/graphql', fetchOptions: {
    credentials: 'include'
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          betterUpdateQuery<LoginMutation, MeQuery>(cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.login.errors) {
                return query
              } else {
                return {
                  me: result.login.user
                }
              }
            }
          )
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.register.errors) {
                return query
              } else {
                return {
                  me: result.register.user
                }
              }
            }
          )
        }
      }
    }
  }), fetchExchange]
});

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <div data-theme="forest">
        <Head>
          <title>Welcome to web!</title>
        </Head>
        <div className="app">
          <header className="flex">
          </header>
          <main>
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </Provider>
  );
}

export default CustomApp;
