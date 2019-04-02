'use strict'

/**
 * @description Auth Controller
 */
const Controller = require('egg').Controller

module.exports = class AuthController extends Controller {
  get rules() {
    return {
      login: {
        username: { type: 'string', required: true },
        password: { type: 'string', required: true }
      },
      update: {
        name: { type: 'string', required: false },
        email: { type: 'email', required: false },
        site: { type: 'url', required: false },
        avatar: { type: 'string', required: false }
      },
      password: {
        password: { type: 'string', required: true, min: 6 },
        oldPassword: { type: 'string', required: true, min: 6 }
      }
    }
  }

  async login() {
    const { ctx } = this
    if (ctx.session._isAuthed) {
      return ctx.fail('你已登录，请勿重复登录')
    }
    const body = this.ctx.validateBody(this.rules.login)
    // const user = await this.service.user.getItem({ name: body.username })
    const user = {
      _id: 1,
      username: 'admin',
      password: '123'
    }
    if (!user) {
      return ctx.fail('用户不存在')
    }
    // const vertifyPassword = this.app.utils.encode.bcompare(
    //   body.password,
    //   user.password
    // )

    const vertifyPassword = body.password === user.password
    if (!vertifyPassword) {
      return ctx.fail('密码错误')
    }
    const token = this.service.auth.setCookie(user, true)
    // 调用 rotateCsrfSecret 刷新用户的 CSRF token
    ctx.rotateCsrfSecret()
    this.logger.info(`用户登录成功, ID：${user._id}，用户名：${user.username}`)
    ctx.success({ id: user._id, token }, '登录成功')
  }

  async logout() {
    const { ctx } = this
    this.service.auth.setCookie(ctx.session._user, false)
    this.logger.info(
      `用户退出成功, 用户ID：${ctx.session._user._id}，用户名：${
        ctx.session._user.name
      }`
    )
    ctx.success('退出成功')
  }

  async info() {
    this.ctx.success(
      {
        info: this.ctx.session._user,
        token: this.ctx.session._token
      },
      '管理员信息获取成功'
    )
  }

  async authRs() {
    const r = await this.app.verifyToken(this.ctx.queries.token[0])
    this.ctx.body = r
  }
}
