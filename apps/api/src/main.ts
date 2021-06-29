import { MikroORM } from '@mikro-orm/core';

(async function () {
  const orm = await MikroORM.init({
    dbName: 'notreddit',
    // user: "",
    // password: "",
    type: 'postgresql',
    debug: process.env.NODE_ENV !== 'production',
  });
})();
