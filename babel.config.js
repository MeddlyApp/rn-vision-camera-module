module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'react-native-reanimated/plugin',
      // 'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', 'jsx', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          // '@components': './src/components',
        },
      },
      // 'react-native-reanimated/plugin', // should be listed last!
    ],
  ],
};
