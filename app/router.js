/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, config } = app

  router.get('/', async ctx => {
    ctx.body = {
      name: config.name,
      version: config.version,
      author: config.pkg.author,
      poweredBy: [ 'Egg', 'Koa2', 'MongoDB', 'Nginx' ]
    }
  })

  require('./route/auth')(app)
  require('./route/user')(app)
  require('./route/mail')(app)
  router.all('*', ctx => {
    const code = 404
    ctx.fail(code, app.config.codeMap[code])
  })
}

