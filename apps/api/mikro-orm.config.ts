import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from '@notreddit/api-constants';
import { Post } from './src/app/entities/Post';

export const ormConfig = {
  dbName: 'notreddit',
  // user: "",
  // password: "",
  type: 'postgresql',
  debug: !__prod__,
  entities: [Post],
} as Parameters<typeof MikroORM.init>[0];
