/**
 * @desc 用户Controller
 */

const { Controller } = require('egg')
const moment = require('moment')

module.exports = class UserController extends Controller {
  get rules() {
    const {
      role
    } = this.config.modelEnum.user
    return {
      create: {
        inviteCode: { type: 'string', required: true },
        username: { type: 'string', required: true },
        password: { type: 'string', required: true, min: 6 },
        email: { type: 'email', required: true },
        avatar: { type: 'string', required: false },
        role: {
          type: 'enum',
          values: Object.values(role.optional),
          required: true
        },
        createdAt: { type: 'string', required: false },
        upatedAt: { type: 'string', required: false }
      },
      update: {
        mute: { type: 'boolean', required: false }
      },
      checkAdmin: {
        userId: { type: 'objectId', required: true },
        token: { type: 'string', required: true }
      },
      identify: {
        inviteCode: { type: 'string', required: true },
        username: { type: 'string', required: true },
        email: { type: 'email', required: true }
      },
      resetpwd: {
        userId: { type: 'string', required: true },
        code: { type: 'string', required: true },
        password: { type: 'string', required: true, min: 6 }
      }
    }
  }

  async list() {
    const { ctx } = this
    let select = '-password'
    if (!ctx.session._isAuthed) {
      select += ' -createdAt -updatedAt -role'
    }
    const query = {
      $nor: [
        {
          role: this.config.modelEnum.user.role.optional.ADMIN
        }
      ]
    }
    const data = await this.service.user.getListWithComments(query, select)
    data
      ? ctx.success(data, '用户列表获取成功')
      : ctx.fail('用户列表获取失败')
  }

  async create() {
    const { app, ctx } = this
    const body = ctx.validateBody(this.rules.create)
    const { inviteCode } = body
    if (!inviteCode || inviteCode.toLowerCase() !== app.config.inviteCode) {
      return ctx.fail('请输入正确的邀请码！')
    }
    const res = await this.service.user.create(body)
    if (res.success) {
      ctx.success(res.data, res.msg)
    } else {
      ctx.fail(res.msg)
    }
  }

  async item() {
    const { ctx } = this
    const { id } = ctx.validateParamsObjectId()
    let select = '-password'
    if (!ctx.session._isAuthed) {
      select += ' -createdAt -updatedAt -github'
    }
    const data = await this.service.user.getItemById(id, select)
    data
      ? ctx.success(data, '用户详情获取成功')
      : ctx.fail('用户详情获取失败')
  }

  async update() {
    const { ctx } = this
    const { id } = ctx.validateParamsObjectId()
    const body = this.ctx.validateBody(this.rules.update)
    const data = await this.service.user.updateItemById(id, body, '-password')
    data
      ? ctx.success(data, '用户更新成功')
      : ctx.fail('用户更新失败')
  }

  async checkAdmin() {
    const { ctx } = this
    ctx.validate(this.rules.checkAdmin, ctx.query)
    const { userId, token } = ctx.query
    let isAdmin = false
    const verify = await this.app.verifyToken(token)
    if (verify) {
      const user = await this.service.user.getItemById(userId)
      if (user.role === this.config.modelEnum.user.role.optional.ADMIN) {
        isAdmin = true
      }
    }
    ctx.success(isAdmin, '校验管理员成功')
  }

  // 重置密码步骤1: 验证用户省份，通过后，发送验证码到用户邮箱。
  async identify() {
    const { app, ctx } = this
    const body = ctx.validateBody(this.rules.identify)
    const { inviteCode } = body
    if (!inviteCode || inviteCode.toLowerCase() !== app.config.inviteCode) {
      return ctx.fail('请输入正确的邀请码！')
    }
    const select = 'username email avatar'
    const data = await this.service.user.getItem({
      username: body.username,
      email: body.email
    }, select)
    if (!data) {
      return ctx.fail('请输入正确的用户名和电子邮箱！')
    }
    let resetpwd = await this.service.resetpwd.getItem({ userid: data._id })
    let res = {}
    if (resetpwd) {
      const deadline = moment(resetpwd.createdAt).add(12, 'h')
      if (deadline > moment.now()) {
        Object.assign(res, { success: true, data: resetpwd })
      } else {
        await this.service.resetpwd.deleteItemById(resetpwd._id)
        resetpwd = await this.service.resetpwd.create({ userid: data._id })
        Object.assign(res, { success: true, data: resetpwd })
      }
    } else {
      res = await this.service.resetpwd.create({ userid: data._id })
    }
    if (!res.success) {
      return ctx.fail('生成Code失败！')
    }
    try {
      await app.mailer.send({
        from: '"No-Reply Big Seller 👻" <no-reply@cloudybaylighting.net>',
        to: data.email,
        subject: '你正在重置密码',
        text: `你重置密码的验证码为${res.data.code}，12小时后失效。`,
        html: `<div>你重置密码的yan 鞥zh码为：</div><h2>${res.data.code}</h2><div>12小时后失效。</div>`
      })
      ctx.success(data, '用户详情获取成功')
    } catch (e) {
      ctx.fail(`验证码邮件发送失败（${data.email}）`)
    }
  }

  /**
   * @description 密码重置
   */
  async resetpwd() {
    const { app, ctx } = this
    const body = this.ctx.validateBody(this.rules.resetpwd)
    const exist = await this.service.user.getItemById(body.userId)
    if (!exist) {
      return ctx.fail('密码重置失败（用户不存在）！')
    }
    const data = await this.service.resetpwd.getItem({
      userid: body.userId,
      code: body.code.toUpperCase()
    })
    if (!data) {
      return ctx.fail('要重置密码，请先校验身份！')
    }
    const deadline = moment(data.createdAt).add(12, 'h')
    if (deadline > moment.now()) {
      const user = await this.service.user.updateItemById(data.userid, {
        password: app.utils.encode.bhash(body.password)
      })
      user
        ? ctx.success('密码重置成功！')
        : ctx.fail('密码重置失败！')
    } else {
      ctx.fail('验证码错误，已过期！请重新开始。')
    }
    await this.service.resetpwd.deleteItemById(data._id)
  }
}
