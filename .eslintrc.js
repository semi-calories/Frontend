// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  extends: ['universe/native'],
  plugins: ['import'],
  rules: {
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'unknown'],
        pathGroups: [
          {
            pattern: 'react+(|-native)',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '~/screens/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '~/components/**',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '~/constants/**',
            group: 'unknown',
            position: 'before',
          },
          {
            pattern: '~/styles/**',
            group: 'unknown',
          },
          {
            pattern: '~/context/**',
            group: 'unknown',
            position: 'after',
          },
          {
            pattern: '~/atoms/**',
            group: 'unknown',
            position: 'after',
          },
          {
            pattern: '~/apis/**',
            group: 'unknown',
            position: 'after',
          },
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
      },
    ],
  },
};
