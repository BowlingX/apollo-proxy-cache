module.exports = {
  presets: [
    '@babel/typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '14',
        },
      },
    ],
  ],
  plugins: ['lodash', '@babel/proposal-class-properties'],
  env: {
    browser: {
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            regenerator: true,
          },
        ],
      ],
      presets: [
        '@babel/typescript',
        [
          '@babel/preset-env',
          {
            targets: {
              chrome: '58',
              ie: '11',
            },
          },
        ],
      ],
    },
  },
}
