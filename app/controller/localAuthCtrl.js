'use strict';
const _omit = require('lodash.omit');

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

  async show() {
    const { ctx } = this;

    ctx.body = {};
  }

  async index() {
    const { ctx } = this;
    ctx.body = {};
  }

  async create() {
    const { ctx } = this;

    ctx.validate(this.createRule);

    const resp = await ctx.service.localAuth.create(ctx.request.body);
    ctx.body = {
      resp,
    };
  }

  async editUserName() {
    const { ctx } = this;
    const uuid = ctx.params.uuid; // 此处的ID需要传入uuid。

    ctx.validate(_omit(this.createRule, [ 'password' ]));
    ctx.body = await ctx.service.localAuth.editUserName({ uuid, newUserName: ctx.request.body.username });
    ctx.status = 204;
  }

  async editPassword() {
    const { ctx } = this;
    const uuid = ctx.params.uuid; // 此处的ID需要传入uuid。

    ctx.validate(_omit(this.createRule, [ 'username' ]));
    ctx.body = await ctx.service.localAuth.editPassword({ uuid, newPassword: ctx.request.body.password });
    ctx.status = 204;
  }
}

module.exports = LocalAuthController;
