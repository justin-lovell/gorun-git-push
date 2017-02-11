'use strict';

export type GitPublishConfiguration = {
  name: string,
  url: string
};

declare type GoRunConfig = null | {
  gitPush: null | {
    obtainConfiguration: (() => GitPublishConfiguration)
  }
};

declare module 'gorun/gorun-config.js' {
  declare module.exports: GoRunConfig;
}
