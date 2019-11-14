module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    describe: 'readonly',
    it: 'readonly',
    jest: 'readonly',
    expect: 'readonly',
    beforeAll: 'readonly',
    afterAll: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'linebreak-style': 0,
    'class-methods-use-this': 0,
  },
};
