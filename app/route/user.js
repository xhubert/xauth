module.exports = app => {
  const userRouter = app.router.namespace('/api')
  const { controller, middlewares } = app
  const auth = middlewares.auth(app)

  // User
  userRouter.get('/users/:id', auth, controller.user.item)
  userRouter.post('/users', controller.user.create)
  userRouter.post('/users/identify', controller.user.identify)
  userRouter.post('/users/resetpwd', controller.user.resetpwd)
  userRouter.patch('/users/:id', auth, controller.user.update)
}
