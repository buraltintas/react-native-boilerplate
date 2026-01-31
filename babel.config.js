module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last!
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@app': './src/app',
            '@navigation': './src/navigation',
            '@features': './src/features',
            '@shared': './src/shared',
            '@infra': './src/infra',
            '@native': './src/native',
          },
        },
      ],
    ],
  };
};
