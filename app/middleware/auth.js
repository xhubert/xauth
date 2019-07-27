/**
 * @description jwt 校验
 */

const compose = require('koa-compose')

// 验证登录token
function verifyToken(app) {
  const { config, logger } = app
  return async (ctx, next) => {
    ctx.session._verify = false
    const token = ctx.cookies.get(config.session.key, app.config.session.signed)
    if (!token) return ctx.fail(401, '请先登录')
    const verify = await app.verifyToken(token)
    if (!verify) return ctx.fail(401, '登录失效，请重新登录')
    ctx.session._verify = true
    ctx.session._token = token
    logger.info('Token校验成功')
    await next()
  }
}

module.exports = app => {
  return compose([
    verifyToken(app),
    async (ctx, next) => {
      if (!ctx.session._verify) {
        return ctx.fail(401)
      }
      const userId = ctx.cookies.get(
        app.config.userCookieKey,
        app.config.session.signed
      )
      const user = await ctx.service.user.getItemById(userId, '-password')
      // const user = {
      //   _id: 1,
      //   username: 'admin',
      //   password: '123'
      // }
      if (!user) {
        return ctx.fail(401, '用户不存在')
      }
      ctx.session._user = user
      ctx.session._isAuthed = true
      await next()
    }
  ])
}
