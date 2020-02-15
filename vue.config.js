/*
 * @Descripttion:
 * @Author:
 * @Date: 2019-11-27 14:21:30
 * @LastEditors:
 * @LastEditTime: 2020-01-13 16:10:52
 */
module.exports = {
  // publicPath: process.env.BUILD_ENV == 'dev' ? '/' : 'adminstyle',
  chainWebpack: config => {
    const buildConfig = require('./src/build/' + process.env.BUILD_ENV + '.js')
    config.plugin('define').tap(args => {
      args[0]['process.env'].BUILD_ENV = JSON.stringify(process.env.BUILD_ENV)
      args[0]['process.env'].API_BASE_URL = JSON.stringify(buildConfig.BASE_URL)
      return args
    })
  }
}
