import { MikroORM } from '@mikro-orm/core';
import { ormConfig } from '../mikro-orm.config';

try {
  (async function () {
    const orm = await MikroORM.init(ormConfig);
  })();
} catch (err) {
  console.error(err);
}
