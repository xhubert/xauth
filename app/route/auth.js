module.exports = app => {
  const authRouter = app.router.namespace('/api')
  const { controller, middlewares } = app
  const auth = middlewares.auth(app)

  // Auth
  authRouter.post('/login', controller.auth.login)
  authRouter.post('/logout', auth, controller.auth.logout)
  authRouter.get('/info', auth, controller.auth.info)
  authRouter.patch('/info', auth, controller.auth.update)
  authRouter.patch('/password', auth, controller.auth.password)
  authRouter.get('/auth/rs', controller.auth.authRs)
}
