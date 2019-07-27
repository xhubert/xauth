module.exports = app => {
  const userRouter = app.router.namespace('/api')
  const { controller, middlewares } = app
  const auth = middlewares.auth(app)

  // User
  userRouter.get('/users', auth, controller.user.list)
  userRouter.get('/users/:id', auth, controller.user.item)
  userRouter.post('/users', controller.user.create)
  userRouter.patch('/users/:id', auth, controller.user.update)
}
