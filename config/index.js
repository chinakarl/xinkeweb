'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    env: require('./dev.env'),      // 使用 config/dev.env.js 中定义的编译环境
    host: 'localhost',              // 运行测试页面的host
    port: 9520,                     // 运行测试页面的端口
    autoOpenBrowser: true,
    autoOpenPage: '/login', 
    assetsSubDirectory: 'static',   // 编译输出的二级目录
    assetsPublicPath: '/',          // 编译发布的根目录，可配置为资源服务器域名或 CDN 域名
    proxyTable: {                   // 需要 proxyTable 代理的接口（可跨域）请求接口地址
      '/api': {
        target: 'http://localhost:8080',
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
    cssSourceMap: false            // 是否开启 cssSourceMap
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
