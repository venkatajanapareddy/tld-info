module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_+', varsIgnorePattern: '^[_]+' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    // Add any project-specific rules here
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    '*.cjs',
    'vitest.config.ts',
    'tsup.config.ts',
    '.eslintrc.cjs',
  ],
};
