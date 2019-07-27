module.exports = app => {
  const backendRouter = app.router.namespace('/api')
  const { controller, middlewares } = app
  const auth = middlewares.auth(app)

  // User
  //   backendRouter.get('/users', auth, controller.user.list)
  //   backendRouter.get('/users/:id', auth, controller.user.item)
  //   backendRouter.patch('/users/:id', auth, controller.user.update)

  // Auth
  backendRouter.post('/auth/login', controller.authCtrl.login)
  backendRouter.post('/auth/logout', auth, controller.authCtrl.logout)
  backendRouter.get('/auth/info', auth, controller.authCtrl.info)
  backendRouter.get('/auth/rs', controller.authCtrl.authRs)
  //   backendRouter.patch('/auth/info', auth, controller.auth.update)
  //   backendRouter.patch('/auth/password', auth, controller.auth.password)
}
