import { createConnection } from 'typeorm';

import { __prod__ } from '@notreddit/api-constants';

import { Post } from './app/entities/Post';

try {
  (async function () {
    await createConnection({
      type: 'postgres',
      database: 'notreddit',
      synchronize: true,
      logging: __prod__,
      entities: [Post],
    });
  })();
} catch (err) {
  console.error(err);
}
