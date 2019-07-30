'use strict'

module.exports = () => {
  const config = exports = {}

  config.security = {
    domainWhiteList: [ '*' ]
  }

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG'
  }

  return config
}
