/**
 * @desc 用户Controller
 */

const { Controller } = require('egg')

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
    const { ctx } = this
    const body = ctx.validateBody(this.rules.create)
    const { inviteCode } = body
    if (!inviteCode || inviteCode.toLowerCase() !== 'cloudybay') {
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
}
