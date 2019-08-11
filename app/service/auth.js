/**
 * @desc Auth Services
 */

const jwt = require('jsonwebtoken')
const { Service } = require('egg')

module.exports = class AuthService extends Service {
  sign(app, payload = {}, isLogin = true) {
    return jwt.sign(payload, app.config.secrets, { expiresIn: isLogin ? app.config.session.maxAge : 0 })
  }

  /**
     * @description 设置cookie，用于登录和退出
     * @param {User} user 登录用户
     * @param {Boolean} isLogin 是否是登录操作
     * @return {String} token 用户token
     */
  setCookie(user, isLogin = true) {
    const { key, domain, maxAge, signed } = this.app.config.session
    const token = this.sign(this.app, {
      id: user._id,
      username: user.username
    }, isLogin)
    const payload = {
      signed,
      domain,
      maxAge: isLogin ? maxAge : 0,
      httpOnly: false
    }
    this.ctx.cookies.set(key, token, payload)
    this.ctx.cookies.set(this.app.config.userCookieKey, user._id, payload)
    return token
  }

  clearCookies() {
    const { key } = this.app.config.session
    // const token = this.sign(this.app, {
    //   id: user._id,
    //   username: user.username
    // })
    // const payload = {
    //   signed,
    //   domain,
    //   maxAge: isLogin ? maxAge : 0,
    //   httpOnly: false
    // }
    this.ctx.cookies.set(key, null)
    this.ctx.cookies.set(this.app.config.userCookieKey, null)
  }

  // 更新session
  async updateSessionUser(admin) {
    this.ctx.session._user = admin || await this.service.user.getItemById(this.ctx.session._user._id, '-password')
    this.logger.info('Session管理员信息更新成功')
  }
}
