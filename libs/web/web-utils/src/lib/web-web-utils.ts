import { dedupExchange, fetchExchange } from 'urql';
import { Cache, cacheExchange, QueryInput } from '@urql/exchange-graphcache';

import { FieldError } from '@notreddit/types';

import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from '../../../../../apps/web/generated/graphql';

export const toErrorMap = (errors: FieldError[]): Record<string, string> => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field.toLowerCase()] = message;
  });

  return errorMap;
};

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUrqlClient = (_ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, _args, cache) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, _args, cache) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          register: (_result, _args, cache) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    fetchExchange,
  ],
});
