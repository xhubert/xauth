'use strict'

/**
 * @desc User Services
 */

const ProxyService = require('./aproxy')

module.exports = class UserService extends ProxyService {
//   get model() {
//     return this.app.model.User
//   }

  // 创建用户
  async create(user, checkExist = true) {
    const { name } = user
    if (checkExist) {
      const exist = await this.getItem({ name })
      if (exist) {
        this.logger.info('用户已存在，无需创建：' + name)
        return exist
      }
    }
    const data = await new this.model(user).save()
    const type = [ '管理员', '用户' ][data.role]
    if (data) {
      this.logger.info(`${type}创建成功：${name}`)
    } else {
      this.logger.error(`${type}创建失败：${name}`)
    }
    return data
  }
}
