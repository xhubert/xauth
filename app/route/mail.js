module.exports = app => {
  const apiRouter = app.router.namespace('/api')
  const { controller } = app

  // Auth
  apiRouter.get('/mail/verify', controller.mail.verify)
}
