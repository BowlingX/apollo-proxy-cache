module.exports =  {
    presets: [
      '@babel/typescript',
      [
        '@babel/preset-env'
      ]
    ],
    plugins: [
      'lodash',
      '@babel/proposal-class-properties'
    ]
}
