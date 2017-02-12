'use strict';

import {
  describe,
  it,
  before,
  after,
  beforeEach
} from 'mocha';

import Assert from 'assert';
import FileSystem from 'fs';
import Path from 'path';

import Del from 'del';
import DeepCopy from 'deepcopy';

import GitRepositoryCpUtil from 'git-repository/lib/utils/cp';

import Run from 'gorun/run';
import GoRunConfig from 'gorun/gorun-config';
import GoRunGitPush from '../lib/index';

describe('gorun-git-push', () => {

  beforeEach(done => {

    const tempDirName = __dirname + '/temp';

    if (!FileSystem.existsSync(tempDirName)) {
      FileSystem.mkdirSync(tempDirName);
    }

    const data = (+new Date()).toString() + '\n';
    const fileName = __dirname + '/temp/a.text';

    if (FileSystem.existsSync(fileName)) {
      FileSystem.unlinkSync(fileName);
    }

    FileSystem.appendFile(fileName, data, {}, done);

  });



  describe('when the dist directory has not been created', () => {

    describe('when the repository is new too', () => {

      let config = null;

      before(() => config = DeepCopy(GoRunConfig));
      after(() => Object.assign(GoRunConfig, config));


      it('should set the config', async() => {

        const workDir = __dirname + '/temp/new-work-dir';
        const gitRepoFile = __dirname + '/temp/existing-repo.git';

        if (FileSystem.existsSync(workDir)) {
          await Del(workDir, {dot: true});
        }

        if (FileSystem.existsSync(gitRepoFile)) {
          await Del(gitRepoFile, {dot: true});
        }

        const gitRepoOpts = {
          cwd: Path.dirname(gitRepoFile),
          stdio: 'inherit'
        };
        const gitRepoArgs = ['init', '--bare', 'existing-repo.git'];
        await GitRepositoryCpUtil.spawn('git', gitRepoArgs, gitRepoOpts);


        GoRunConfig.gitPush = GoRunConfig.gitPush || {};
        GoRunConfig.gitPush.obtainConfiguration = () => ({
          name: 'test',
          url: gitRepoFile,
          path: workDir
        });

        GoRunConfig.directoriesToClean = [
          `${workDir}/*`,
          `!${workDir}/.git`
        ];
        GoRunConfig.copy = [
          {
            initialize: {
              source: 'test/temp/a.text',
              destination: 'test/temp/new-work-dir'
            }
          }
        ];

      });

      it('should push to the repository', async() => {

        await Run(GoRunGitPush)

      });

    });


    describe('when the repository has history', () => {

      let config = null;

      before(() => config = DeepCopy(GoRunConfig));
      after(() => Object.assign(GoRunConfig, config));


      it('should set the config', async() => {

        const workDir = __dirname + '/temp/new-work-dir';
        const gitRepoFile = __dirname + '/temp/existing-repo.git';

        if (FileSystem.existsSync(workDir)) {
          await Del(workDir, {dot: true});
        }

        Assert.ok(FileSystem.existsSync(gitRepoFile), 'git repo does not exist');

        GoRunConfig.gitPush = GoRunConfig.gitPush || {};
        GoRunConfig.gitPush.obtainConfiguration = () => ({
          name: 'test',
          url: gitRepoFile,
          path: workDir
        });

        GoRunConfig.directoriesToClean = [
          `${workDir}/*`,
          `!${workDir}/.git`
        ];
        GoRunConfig.copy = [
          {
            initialize: {
              source: 'test/temp/a.text',
              destination: 'test/temp/new-work-dir'
            }
          }
        ];

      });

      it('should push to the repository', async() => {

        await Run(GoRunGitPush);

      });

    });

  });





  describe('when the repository has history', () => {

    let config = null;

    before(() => config = DeepCopy(GoRunConfig));
    after(() => Object.assign(GoRunConfig, config));


    it('should set the config', async() => {

      const workDir = __dirname + '/temp/new-work-dir';
      const gitRepoFile = __dirname + '/temp/existing-repo.git';

      Assert.ok(FileSystem.existsSync(workDir), 'directory does not exist');
      Assert.ok(FileSystem.existsSync(Path.join(workDir, 'a.text')), 'file does not exist');
      Assert.ok(FileSystem.existsSync(gitRepoFile), 'git repo does not exist');

      GoRunConfig.gitPush = GoRunConfig.gitPush || {};
      GoRunConfig.gitPush.obtainConfiguration = () => ({
        name: 'test',
        url: gitRepoFile,
        path: workDir
      });

      GoRunConfig.directoriesToClean = [
        `${workDir}/*`,
        `!${workDir}/.git`
      ];
      GoRunConfig.copy = [
        {
          initialize: {
            source: 'test/temp/a.text',
            destination: 'test/temp/new-work-dir'
          }
        }
      ];

    });

    it('should push to the repository', async() => {

      await Run(GoRunGitPush);

    });

  });



});
