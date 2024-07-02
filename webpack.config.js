const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = ({ env }) => ({
  entry: './src/index.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        // 小于10k的图片在img下不会有图片文件，而是直接把图片的base64值写到html引入图片的地方
        // 大于10k的图片会放在img下，需要的时候通过http请求下载
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer'),
                  env === 'production' ? require('cssnano') : null,
                  require('postcss-url')([
                    {
                      filter: '**/*',
                      url: (asset) => {
                        console.log('xxxxxxxxx', asset.url);
                        return `"${asset.url}"`;
                      },
                    },
                    // {
                    //   filter: 'http[s]?://(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:/[^\s]*)?',
                    //   url: (asset) => {
						        //     console.log('xxxxxxxxxxxxxxxxxxx', asset.url)
                    //     return `"${asset.url}11111111111"`;
                    //   },
                    // },
                    // { filter: '**/*', url: 'inline' },
                  ]),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
    },
  },
});
