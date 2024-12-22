import pluginQuery from '@tanstack/eslint-plugin-query';

export default [
    {
        plugins: {
            '@tanstack/query': pluginQuery,
        },
        rules: {
            '@tanstack/query/exhaustive-deps': 'error',
        },
    },
];
