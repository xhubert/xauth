'use strict';

const Controller = require('egg').Controller;

class LocalAuthController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.createRule = {
      username: {
        type: 'string',
        max: 32,
        min: 5,
      },
      password: {
        type: 'string',
        max: 20,
        min: 6,
      },
    };
  }

  async create() {
    const { ctx } = this;
    ctx.validate(this.createRule);

    const id = await ctx.service.localAuth.create(ctx.request.body);
    ctx.body = {
      id,
    };
    ctx.status = 201;
  }
}

module.exports = LocalAuthController;
