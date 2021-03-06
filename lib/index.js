'use strict';

import GitRepository from 'git-repository';
import Run from 'gorun/run';
import Build from 'gorun/build';
import GoRunConfig from 'gorun/gorun-config';
import AppRootPath from 'app-root-path';
import Path from 'path';
import FileSystem from 'fs';

function extractConfig() {
  const fetchConfig = GoRunConfig && GoRunConfig.gitPush && GoRunConfig.gitPush.obtainConfiguration;

  if (!fetchConfig) {
    throw Error('Please define the gorun.pack.js to contain the gitPush.obtainConfiguration method');
  }

  const config: {
    name:string,
    url:string,
    path:string
  } = fetchConfig();


  if (!config || !config.name || !config.url || !config.path) {
    throw Error('gitPush.obtainConfiguration returned an object other than {name:string, url: string, path: string}');
  }

  return config;
}

function obtainPath(path) {
  if (path && path.length && path[0] === '/') {
    return path;
  }

  return Path.join(AppRootPath.toString(), path);
}

// async function prepareRepositoryForBuild(fullPath) {
//
// }

async function deploy() {

  const config = extractConfig();
  const fullPath = obtainPath(config.path);

  if (!FileSystem.existsSync(fullPath)) {
    FileSystem.mkdirSync(fullPath);
  }

  let repo = await GitRepository.open(fullPath, {init: true});

  await repo.setRemote(config.name, config.url);
  await repo.fetch(config.name);
  await repo.clean(fullPath, {force: true});
  await repo.reset(`remotes/${config.name}/master`, {hard: true});

  await Run(Build);

  await repo.add(`--all .`);
  await repo.commit('.');
  await repo.push(config.name, 'master');

}

export default deploy;
