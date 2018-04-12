'use strict';

const _omit = require('lodash.omit');
const uuid = require('../../app/lib/uuid');

const Service = require('egg').Service;

// const attributes = [ 'id', 'uuid', 'username', 'status' ];

/**
 * The user Account of local.
 */
class LocalAuth extends Service {

  async create(localAuth) {
    _omit(localAuth, [ 'id', 'status', 'createdAt', 'updatedAt' ]);
    localAuth.uuid = uuid.shortId();

    return this.ctx.model.LocalAuth.create(localAuth);
  }
}

module.exports = LocalAuth;
