module.exports =  {
    presets: [
      '@babel/typescript',
      [
        '@babel/preset-env',
        {
          targets: {
            node: process.versions.node,
          },
        },
      ]
    ],
    plugins: [
      'lodash',
      '@babel/proposal-class-properties'
    ]
}
