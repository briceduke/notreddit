import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { __prod__ } from '@notreddit/api-constants';

import { Post } from './app/entities/Post';
import { User } from './app/entities/User';
import { PingResolver, PostResolver, UserResolver } from './app/resolvers';

try {
  (async function () {
    await createConnection({
      type: 'postgres',
      database: 'notreddit',
      synchronize: true,
      logging: __prod__,
      entities: [Post, User],
    });

    const app = express();

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [PingResolver, PostResolver, UserResolver],
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
