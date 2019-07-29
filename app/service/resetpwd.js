/**
 * @desc User Services
 */

const BasicService = require('./basic')

const genStr = length => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

module.exports = class ResetpwdService extends BasicService {
  get model() {
    return this.app.model.Resetpwd
  }
  async create(values) {
    const { userid } = values
    let msg = ''
    const user = await this.service.user.getItemById(userid)
    if (!user) {
      msg = '用户不存在！'
      return {
        success: false,
        msg
      }
    }

    const code = genStr(6)

    const data = await new this.model(
      Object.assign(
        {},
        values,
        { code }
      )
    ).save()

    if (data) {
      msg = '创建成功！'
      return {
        success: true,
        msg,
        data
      }
    }
    msg = '创建失败！'
    return {
      success: false,
      msg,
      data
    }
  }
}
