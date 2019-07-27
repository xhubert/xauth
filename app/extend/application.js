const mongoosePaginate = require('mongoose-paginate-v2')
const jwt = require('jsonwebtoken')
const merge = require('merge')

module.exports = {
  // model schema处理
  processSchema(schema, options = {}, middlewares = {}) {
    if (!schema) {
      return null
    }
    schema.set('versionKey', false)
    schema.set('toObject', { getters: true, virtuals: false })
    schema.set('toJSON', { getters: true, virtuals: false })
    schema.add({
      // 创建日期
      createdAt: { type: Date, default: Date.now },
      // 更新日期
      updatedAt: { type: Date, default: Date.now }
    })
    if (options && options.paginate) {
      schema.plugin(mongoosePaginate)
    }
    schema.pre('findOneAndUpdate', function(next) {
      this._update.updatedAt = Date.now()
      next()
    })
    Object.keys(middlewares).forEach(key => {
      const fns = middlewares[key]
      Object.keys(fns).forEach(action => {
        schema[key](action, fns[action])
      })
    })
    return schema
  },
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
