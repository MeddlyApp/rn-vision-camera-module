module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*'], // specify the file(s) you want to override
      rules: {
        curly: 'off', // disable the curly rule for this file
      },
    },
  ],
};
