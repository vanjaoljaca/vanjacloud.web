module.exports = function (wallaby) {
    return {
        files: [
            'tsconfig.json',
            'src/**/*.ts',
            'src/**/*.tsx',
            '!src/**/*.test.ts',
            '!src/**/*.test.tsx',
        ],

        tests: ['src/**/*.test.ts', 'src/**/*.test.tsx'],

        env: {
            type: 'node',
            runner: 'node',
        },

        testFramework: 'jest',
    };
};
