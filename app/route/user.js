module.exports = app => {
  const userRouter = app.router.namespace('/api')
  const { controller, middlewares } = app
  const auth = middlewares.auth(app)

  // User
  userRouter.get('/users/:id', auth, controller.user.item)
  userRouter.post('/users', controller.user.create)
  userRouter.post('/users/identify', controller.user.identify)
  userRouter.post('/users/resetpwd', controller.user.resetpwd)
  userRouter.patch('/users/:id/username', auth, controller.user.updateUsername)
  userRouter.patch('/users/:id/email', auth, controller.user.updateEmail)
  userRouter.patch('/users/password', auth, controller.user.password)
}
