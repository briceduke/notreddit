import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { __prod__ } from '@notreddit/api-constants';

import { Post } from './app/entities/Post';
import { PingResolver } from './app/resolvers/ping';

try {
  (async function () {
    await createConnection({
      type: 'postgres',
      database: 'notreddit',
      synchronize: true,
      logging: __prod__,
      entities: [Post],
    });

    const app = express();

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [PingResolver],
        validate: false,
      }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
      console.log(`API > Started on http://localhost:4000/graphql`);
    });
  })();
} catch (err) {
  console.error(err);
}
