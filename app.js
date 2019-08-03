const path = require('path')

module.exports = app => {
  app.loader.loadToApp(path.join(app.config.baseDir, 'app/utils'), 'utils')
  addValidateRule(app)

  app.beforeStart(async () => {
    const ctx = app.createAnonymousContext()
    // 初始化管理员（如果有必要）
    await ctx.service.user.seed()
  })
}

function addValidateRule(app) {
  app.validator.addRule('objectId', (rule, val) => {
    const valid = app.utils.validate.isObjectId(val)
    if (!valid) {
      return 'must be objectId'
    }
  })
  app.validator.addRule('email', (rule, val) => {
    const valid = app.utils.validate.isEmail(val)
    if (!valid) {
      return 'must be email'
    }
  })
  app.validator.addRule('url', (rule, val) => {
    const valid = app.utils.validate.isUrl(val)
    if (!valid) {
      return 'must be url'
    }
  })
}
