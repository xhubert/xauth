'use strict';

module.exports = {
  up: async (db, Sequelize) => {
    const { INTEGER, STRING, DATE, CHAR, TINYINT, NOW } = Sequelize;

    await db.createTable('local_auth', {
      id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: { type: CHAR(22), allowNull: false, unique: true, comments: '用户ID，UUID。' },
      username: { type: STRING(32), allowNull: false, unique: true, comments: '用户帐号。' },
      password: {
        type: CHAR(32),
        allowNull: false,
        comments: '用户密码',
      },
      status: {
        type: TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '是否正常状态，正常状态才可以登录。1: 正常；0: 不可用；',
      },
      // Timestamps
      createdAt: { type: DATE, allowNull: false },
      updatedAt: { type: DATE, allowNull: false },
    });
    await db.createTable('oauth', {
      id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: INTEGER.UNSIGNED,
        references: {
          model: 'local_auth',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      oauth_name: { type: STRING(30), comment: 'weibo/qq' },
      oauth_id: {
        type: STRING,
        allowNull: false,
        comment: 'oauth_id',
      },
      oauth_access_token: { type: STRING },
      oauth_expires: { type: DATE },
      // Timestamps
      createdAt: { type: DATE, defaultValue: NOW },
      updatedAt: { type: DATE },
    });
    await db.createTable('api_auth', {
      id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: INTEGER.UNSIGNED,
        references: {
          model: 'local_auth',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      api_key: { type: STRING(100), allowNull: false, comment: '' },
      api_secret: { type: STRING(100), allowNull: false, comment: '' },
      // Timestamps
      createdAt: { type: DATE, defaultValue: NOW },
      updatedAt: { type: DATE },
    });
  },

  down: async db => {
    await db.dropTable('oauth');
    await db.dropTable('api_auth');
    await db.dropTable('local_auth');
  },
};
