module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          ie: 11,
          edge: 14,
          firefox: 52,
          chrome: 49,
          safari: 10,
        },
        modules: false,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        loose: true,
      },
    ],
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-transform-react-constant-elements',
    [
      'transform-react-remove-prop-types',
      {
        mode: 'wrap',
      },
    ],
    '@babel/plugin-transform-runtime',
  ],
}
