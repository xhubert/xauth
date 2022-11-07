/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const env = require('dotenv').config()
  if (env.error) {
    throw new Error('请先在项目根目录增加环境配置文件‘.env’。')
  }

  const config = {}

  config.version = appInfo.pkg.version
  // use for cookie sign key, should change to your own and keep security
  config.keys = `${appInfo.name}_1523199498375_4694`
  config.secrets = `${appInfo.name}_secrets`
  config.author = appInfo.pkg.author

  config.isProd = appInfo.env === 'prod'

  config.session = {
    key: `${appInfo.name}_token`,
    maxAge: 1000 * 60 * 60 * 24 * 1, // 1 Day
    signed: true
  }

  // add your middleware config here
  config.middleware = ['errorHandler']
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  }

  config.security = {
    domainWhiteList: ['http://127.0.0.1', 'http://localhost'],
    csrf: {
      cookieName: 'XSRF-TOKEN', // same to the default of axios.
      headerName: 'X-XSRF-TOKEN'
      // ipBlackList: [
      //   '10.0.0.0/8', // 支持 IP 网段
      //   '0.0.0.0/32',
      //   '127.0.0.1', // 支持指定 IP 地址
      // ],
      // // 配置了 checkAddress 时，ipBlackList 不会生效
      // checkAddress(ip) {
      //   return ip !== '127.0.0.1';
      // },
    }
  }

  // mongoose配置
  config.mongoose = {
    url: `mongodb://xauth:${process.env.DB_PWD}@${process.env.DB_IP}:27017/xauth`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 20,
      keepAlive: true,
      useCreateIndex: true,
      // autoReconnect: true,
      // reconnectInterval: 1000,
      // reconnectTries: Number.MAX_VALUE,
      useFindAndModify: false
    }
  }

  config.mailer = {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAILER_USR, // generated ethereal user
      pass: process.env.MAILER_PWD // generated ethereal password
    }
  },

  // 请求响应code
  config.codeMap = {
    '-1': '请求失败',
    200: '请求成功',
    401: '权限校验失败',
    403: 'Forbidden',
    404: 'URL资源未找到',
    422: '参数校验失败',
    500: '服务器错误'
  }

  // 初始化管理员，默认的名称和密码
  config.defaultAdmin = {
    username: 'Admin',
    password: 'admin123456',
    email: 'hubert.fan@outlook.com'
  }

  // add your user config here
  const userConfig = {
    userCookieKey: appInfo.name + '_userid',
    defaultAvatar:
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // myAppName: 'egg',
  }
  config.modelEnum = require('./enum.js').enum

  return {
    inviteCode: 'cld-bay',
    ...config,
    ...userConfig
  }
}
