const localConfig = {
  /**
   * Add your entry points below. This object expects to be keyed like:
   * ```js
   * {
   *   'DRUPAL_PROJECT_TYPE/DRUPAL_PROJECT_NAME': './sites/all/DRUPAL_PROJECT_TYPE/DRUPAL_PROJECT_NAME'
   * }
   * ```
   * Pay careful attention to the path. If your module is inside of custom or another
   * directory, make sure to to include that part of the path with it.
   */
  drupalPaths: {
    'module/rc_api_user': './sites/all/modules/rescms/rc_api_user',
    'module/rc_api_boost': './sites/all/modules/rescms/rc_boost_core'
  },
  devServer: {
    proxy: {
      '**': {
        target: 'http://MYVHOST.test',
        headers: {
          host: 'MYVHOST.test',
        },
      },
    },
  }
};

module.exports = localConfig;