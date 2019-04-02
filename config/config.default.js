'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */

// const dbconf = require('../db/config.json');

module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/

   const config = {}

   config.version = appInfo.pkg.version
   // use for cookie sign key, should change to your own and keep security
  config.keys = `${appInfo.name}_1523199498375_4694`
  config.secrets = `${appInfo.name}_secrets`

  config.session = {
    key: `${appInfo.name}_token`,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    signed: true
  }

  // config.sequelize = dbconf.development;

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.security = {
    domainWhiteList: [ 'http://127.0.0.1', 'http://localhost' ],
    csrf: {
      cookieName: 'XSRF-TOKEN', // same to the default of axios.
      headerName: 'X-XSRF-TOKEN',
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

  // add your user config here
  const userConfig = {
    userCookieKey: appInfo.name + '_userid',
    defaultAvatar: 'https://static.jooger.me/img/common/avatar.png'
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig
  }
};
