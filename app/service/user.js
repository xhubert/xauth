/**
 * @desc User Services
 */

const BasicService = require('./basic')

module.exports = class UserService extends BasicService {
  get model() {
    return this.app.model.User
  }

  /**
     * @description 创建管理员，用于server初始化时
     */
  async seed() {
    const ADMIN = this.config.modelEnum.user.role.optional.ADMIN
    let admin = await this.service.user.getItem({ role: ADMIN })
    if (!admin) {
      const defaultAdmin = this.config.defaultAdmin
      admin = await this.create(Object.assign({}, defaultAdmin, {
        role: ADMIN
      }))
    }
    // 挂载在session上
    this.app._admin = admin
  }

  // 创建用户
  async create(user, checkExist = true) {
    const { username, email } = user
    let msg = ''
    if (checkExist) {
      let exist = await this.getItem({ username })
      if (exist) {
        msg = `用户账户“${username}”已存在！`
        return {
          success: false,
          msg
        }
      }
      exist = await this.getItem({ email })
      if (exist) {
        msg = `注册邮箱“${email}”已存在！`
        return {
          success: false,
          msg
        }
      }
    }
    const data = await new this.model(
      Object.assign(
        {},
        user,
        {
          password: this.app.utils.encode.bhash(user.password),
          avatar: this.app.utils.gravatar(user.email)
        }
      )
    ).save()

    const type = [ '管理员', '用户' ][data.role]

    if (data) {
      msg = `${type} “${username}” 创建成功！`
      return {
        success: true,
        msg,
        data
      }
    }
    msg = `${type} “${username}” 创建失败！`
    return {
      success: false,
      msg,
      data
    }
  }

  // 更新用户
  async updateUsernameOrEmailById(id, data) {
    const opt = {
      lean: true,
      new: true,
      select: 'username, email'
    }
    let exist = null
    let msg = ''
    if (data.username) {
      exist = await this.getItem({ username: data.username })
      if (exist) {
        msg = `该用户帐号「${data.username}」已存在！`
        return {
          success: false,
          msg
        }
      }
    }
    if (data.email) {
      exist = await this.getItem({ email: data.email })
      if (exist) {
        msg = `该注册邮箱「${data.email}」已存在已存在！`
        return {
          success: false,
          msg
        }
      }
    }
    const Q = await this.model.findByIdAndUpdate(id, data, opt).exec()
    if (Q) {
      return {
        success: true,
        data: Q
      }
    }
    return {
      success: false
    }
  }

  async updateAvatarById(id, data) {
    const opt = {
      lean: true,
      new: true,
      select: 'username, email, avatar'
    }
    const Q = await this.model.findByIdAndUpdate(id, { avatar: data.avatar }, opt).exec()
    if (Q) {
      return {
        success: true,
        data: Q
      }
    }
    return {
      success: false
    }
  }

  /**
     * @description 评论用户创建或更新
     * @param {*} author 评论的author
     * @return {User} user
     */
  async checkCommentAuthor(author) {
    let user = null
    let error = ''
    const { isObjectId, isObject } = this.app.utils.validate
    if (isObjectId(author)) {
      user = await this.getItemById(author)
    } else if (isObject(author)) {
      const update = {}
      author.username && (update.username = author.username)
      author.site && (update.site = author.site)
      author.email && (update.email = author.email)
      update.avatar = this.app.utils.gravatar(author.email)
      const id = author.id || author._id

      const updateUser = async (exist, update) => {
        const hasDiff = exist && Object.keys(update).some(key => update[key] !== exist[key])
        if (hasDiff) {
          // 有变动才更新
          user = await this.updateItemById(exist._id, update)
          if (user) {
            this.logger.info('用户更新成功：' + exist.username)
            this.service.notification.recordUser(exist, 'update')
          }
        } else {
          user = exist
        }
      }

      if (id) {
        // 更新
        if (isObjectId(id)) {
          user = await this.getItemById(id)
          await updateUser(user, update)
        }
      } else {
        // 根据 email 和 name 确定用户唯一性
        const exist = await this.getItem({
          email: update.email,
          username: update.username
        })
        if (exist) {
          // 更新
          await updateUser(exist, update)
        } else {
          // 创建
          user = await this.create(Object.assign(update, {
            role: this.config.modelEnum.user.role.optional.NORMAL
          }), false)
          if (user) {
            this.service.notification.recordUser(user, 'create')
            this.service.stat.record('USER_CREATE', { user: user._id }, 'count')
          }
        }
      }
    }

    if (!user && !error) {
      error = '用户不存在'
    }
    return { user, error }
  }

  /**
     * @description 检测用户以往spam评论
     * @param {User} user 评论作者
     * @return {Boolean} 是否能发布评论
     */
  async checkUserSpam(user) {
    if (!user) return
    const comments = await this.service.comment.getList({ author: user._id })
    const spams = comments.filter(c => c.spam)
    if (spams.length >= this.app.setting.limit.commentSpamMaxCount) {
      // 如果已存在垃圾评论数达到最大限制
      if (!user.mute) {
        user = await this.updateItemById(user._id, { mute: true })
        this.logger.info(`用户禁言成功：${user.username}`)
      }
      return false
    }
    return true
  }
}
