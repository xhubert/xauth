'use strict';

const _omit = require('lodash.omit');
const uuid = require('../../app/lib/uuid');

// const attributes = [ 'id', 'uuid', 'username', 'status' ];

const Service = require('egg').Service;

/**
 * The user Account of local.
 */
class LocalAuth extends Service {

  async create(localAuth) {
    _omit(localAuth, [ 'id', 'uuid', 'status', 'createdAt', 'updatedAt' ]);
    localAuth.uuid = uuid.shortId();

    return this.ctx.model.LocalAuth.create(localAuth);
  }

  async editUserName({ uuid, newUserName }) {
    const localAuth = await this.ctx.model.LocalAuth.findOne({ where: { uuid } });
    if (!localAuth) {
      this.ctx.throw(404, 'LocalAuth User is not found!');
    }
    return localAuth.update({ username: newUserName });
  }

  async editPassword({ uuid, newPassword }) {
    const localAuth = await this.ctx.model.LocalAuth.findOne({ where: { uuid } });
    if (!localAuth) {
      this.ctx.throw(404, 'LocalAuth User is not found!');
    }
    return localAuth.update({ password: newPassword });
  }
}

module.exports = LocalAuth;
