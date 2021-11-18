import checker from 'vite-plugin-checker';

export default {
  plugins: [
    checker({
      typescript: true,
      eslint: {
        files: ['./src'],
        extensions: ['.ts'],
      },
    }),
  ],
};
