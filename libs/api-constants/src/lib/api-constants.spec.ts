import { __prod__ } from './api-constants';

describe('__prod__', () => {
  it('should work', () => {
    expect(__prod__).toEqual(process.env.NODE_ENV !== 'production');
  });
});
