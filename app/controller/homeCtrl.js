const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    const { ctx } = this
    ctx.body = 'Hello World!'
  }

  async login() {
    this.ctx.body = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>LoginPage</title>
</head>
<body>
    <form action="/login" method="post">
        <input type="hidden" name="_csrf" value="${this.ctx.csrf}">
        <label for="loginname">
            LoginName:
            <input type="text" value="asdfasdf" id="loginname" name="loginname">
        </label>
        <label for="password">
            Password:
            <input type="text" value="asfdfdf" id="password" name="password">
        </label>

        <input type="submit" value="Submit">
    </form>
</body>
</html>`
  }

  async profile() {
    if (this.ctx.isAuthenticated()) {
      this.ctx.body = this.ctx.user
    } else {
      // this.ctx.redirect('/login');
      this.ctx.body = { message: 'not loged in.' }
    }
  }

  async authCallback() {
    await this.ctx.login(this.ctx.user)
    this.ctx.redirect('/profile')
  }
}

module.exports = HomeController
