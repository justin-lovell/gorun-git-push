'use strict';


const copyJavaScript = {
  initialize: [{
    source: 'lib/**/*.js',
    destination: 'dist'
  }],
  transform: require('gorun/transform-babel')
};

const copyPackageJson = {
  initialize: [{
    source:'package.json',
    destination: 'dist'
  }]
};

let config = {
  directoriesToClean: () => [
    'dist/*'
  ],
  copy: [
    copyJavaScript,
    copyPackageJson
  ]
};

export default config;
