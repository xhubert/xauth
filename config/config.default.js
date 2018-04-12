'use strict';

const dbconf = require('./database.json');

module.exports = appInfo => {
  const config = exports = {};
  config.sequelize = dbconf.development;

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1523199498375_4694';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  config.security = {
    domainWhiteList: [
      'http://localhost',
      'http://127.0.0.1',
    ],
    ssrf: {
      headerName: 'x-csrf-token',
      // ipBlackList: [
      //   '10.0.0.0/8', // 支持 IP 网段
      //   '0.0.0.0/32',
      //   '127.0.0.1', // 支持指定 IP 地址
      // ],
      // // 配置了 checkAddress 时，ipBlackList 不会生效
      // checkAddress(ip) {
      //   return ip !== '127.0.0.1';
      // },
    },
  };

  return config;
};
