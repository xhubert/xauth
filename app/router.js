'use strict'

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
      github: 'https://github.com/jo0ger',
      poweredBy: [ 'Egg', 'Koa2', 'MongoDB', 'Nginx', 'Redis' ]
    }
  })

  require('./route/api')(app)

  router.all('*', ctx => {
    const code = 404
    ctx.fail(code, app.config.codeMap[code])
  })
}
