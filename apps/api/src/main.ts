import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import redis from 'redis';
import session from 'express-session';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { cookieName, __prod__ } from '@notreddit/api-constants';
import { ApiContext } from '@notreddit/api-types';

import { Post } from './app/entities/Post';
import { User } from './app/entities/User';
import { PingResolver, PostResolver, UserResolver } from './app/resolvers';

dotenv.config();

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

    const redisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
      cors({
        origin: 'http://localhost:4200',
        credentials: true,
      })
    );

    app.use(
      session({
        name: cookieName,
        store: new redisStore({ client: redisClient, disableTouch: true }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
          httpOnly: true,
          secure: !__prod__, // https only in prod
          sameSite: 'strict', // csrf
        },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        secret: process.env.REDIS_SECRET!,
        resave: false,
        saveUninitialized: false,
      })
    );

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [PingResolver, PostResolver, UserResolver],
        validate: false,
      }),
      context: ({ req, res }): ApiContext => ({ req, res }),
    });

    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

    app.listen(4000, () => {
      console.log(`API > Started on http://localhost:4000/graphql`);
    });
  })();
} catch (err) {
  console.error(err);
}
