module.exports = {
    env: {
        es6: true,
        node: true,
    },
    // 启用TypeScript插件
    plugins: [
        '@typescript-eslint'
    ],
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-base',
        // 启用typescript的规则
        'plugin:@typescript-eslint/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018, // ES的版本
    },
    settings: {
        "import/resolver": {
            node: { // 限制node端的import
                extensions: [".js", ".ts"]
            },
        }
    },
    rules: {
        'indent': ['error', 4, {
            "SwitchCase": 1
        }],
        'no-console': ['error', {
            allow: ['log', 'error']
        }],
        'no-underscore-dangle': ['error', {
            'allowAfterThis': true
        }],
        'no-unused-expressions': ['error', {
            'allowShortCircuit': true
        }],
        'spaced-comment': ['error', 'always', {
            'exceptions': ['*']
        }],
        'no-await-in-loop': 'off',
        'no-use-before-define': ['error', 'nofunc'],
    },
};
