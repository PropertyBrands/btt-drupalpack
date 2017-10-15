const path = require('path')
const glob = require('glob')
const webpack = require('webpack')

const localConfig = require('./local.config.js')

const config = {
  entry: function() {
    const matches = {};
    Object.keys(localConfig.drupalPaths).forEach(function(item) {

      const options = {
        cwd: path.resolve(__dirname, localConfig.drupalPaths[item]),
      };

      [].concat(glob.sync('**/*.js', options), glob.sync('scss/*.scss', options)).forEach(filePath => {
        const entryName = `${item}/${path.basename(filePath).split('.').shift()}`;

        if (!matches.hasOwnProperty(entryName)) {
          matches[entryName] = [];
        }

        matches[entryName].push(path.resolve(options.cwd, filePath));

        if (process.env.NODE_ENV === 'development') {
          matches[entryName].push('webpack-dev-server/client?http://localhost:8080');
          matches[entryName].push('webpack/hot/dev-server');
        }

        const onlyUnique = (value, index, self) => self.indexOf(value) === index;

        matches[entryName] = matches[entryName].filter(onlyUnique);
      });

    });
    return matches;

  },
  output: {
    path: path.resolve(__dirname, 'sites/default/files/webpack'),
    publicPath: '/sites/default/files/webpack',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true,
    },
    contentBase: path.resolve(__dirname, 'sites/default/files/webpack'),
    publicPath: '/sites/default/files/webpack',
    hot: true,
    inline: true,
    proxy: localConfig.devServer.proxy,
    watchOptions: {
      poll: true,
    },
  },
  performance: {
    hints: false
  },
  devtool: '#source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}

module.exports = config