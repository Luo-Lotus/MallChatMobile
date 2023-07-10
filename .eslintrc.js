module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    // Note: you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off', // <--- THIS IS THE NEW RULE
  },
};
