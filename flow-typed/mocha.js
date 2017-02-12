'use strict';

import type {
  describe,
  it,
  context,
  before,
  after,
  beforeEach,
  afterEach
} from './npm/mocha_v3.1.x';

declare type MochaType = {
  describe: typeof describe,
  it: typeof it,
  context: typeof context,
  before: typeof before,
  after: typeof after,
  beforeEach: typeof beforeEach,
  afterEach: typeof afterEach
}

declare module 'mocha' {
  declare module.exports: MochaType;
}
