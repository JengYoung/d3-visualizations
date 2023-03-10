module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-custom`
  env: {
    node: true,
    browser: true,
  },
  extends: ['next', 'plugin:react/recommended', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'eol-last': ['error', 'always'],
    'no-console': 'error',
    'react/no-unused-prop-types': 'error',
    'import/no-cycle': 'error',
  },
  overrides: [
    {
      files: ['**/*.tsx', '**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['react', '@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],

      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        'react/no-unused-prop-types': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'error',
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
      },

      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            /**
             * @inner
             * always try to resolve types under `<root>@types` directory
             * even it doesn't contain any source code, like `@types/unist`,
             * @see: https://www.npmjs.com/package/eslint-import-resolver-typescript
             */
            alwaysTryTypes: true,
          },
        },
      },
    },
  ],
};
