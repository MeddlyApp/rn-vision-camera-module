module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'react-native-worklets-core/plugin',
      'react-native-reanimated/plugin',   // Must be last   
      // 'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', 'jsx', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          // '@components': './src/components',
        },
      },
    ],
  ],
};
