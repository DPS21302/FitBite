module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        'no-unused-vars': 'off',
        'react-hooks/exhaustive-deps': 'off',
    },
};