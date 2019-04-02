'use strict'

const jwt = require('jsonwebtoken')
const merge = require('merge')

module.exports = {
  async verifyToken(token) {
    if (token) {
      let decodedToken = null
      try {
        decodedToken = await jwt.verify(token, this.config.secrets)
      } catch (err) {
        this.logger.warn('Token校验出错，错误：' + err.message)
        return false
      }
      if (decodedToken && decodedToken.exp > Math.floor(Date.now() / 1000)) {
        // 已校验权限
        this.logger.info('Token校验成功')
        return true
      }
    }
    return false
  },
  merge() {
    return merge.recursive.apply(
      null,
      [ true ].concat(Array.prototype.slice.call(arguments))
    )
  }
}
