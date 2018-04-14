'use strict';

const crypto = require('../lib/crypto');

module.exports = app => {
  const {
    STRING,
    CHAR,
    TINYINT,
    INTEGER,
  } = app.Sequelize;

  const LocalAuth = app.model.define('local_auth', {
    id: {
      type: INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: CHAR(22),
      allowNull: false,
      unique: true,
      comments: '用户ID，UUID。',
    },
    username: {
      type: STRING(32),
      allowNull: false,
      unique: {
        args: true,
        msg: 'Oops. Looks like you already have an account with this username. Please try to login.',
        fields: [ 'username' ],
      },
      comments: '用户帐号。',
    },
    password: {
      type: CHAR(32),
      allowNull: false,
      comments: '用户密码',
      set(val) {
        const cipher = crypto.encryptWithSalt(val);
        this.setDataValue('password', cipher);
      },
    },
    status: {
      type: TINYINT,
      // allowNull: false,
      // defaultValue: 1,
      allowNull: {
        args: false,
        msg: 'status cannot be null.',
        fields: [ 'status' ],
      },
      comment: '是否正常状态，正常状态才可以登录。1: 正常；0: 不可用；',
    },
    // Timestamps
    // createdAt: {
    //   type: DATE,
    //   allowNull: false,
    //   defaultValue: app.Sequelize.fn('NOW')
    // },
    // updatedAt: {
    //   type: DATE,
    //   allowNull: false,
    //   defaultValue: app.Sequelize.fn('NOW'),
    // },
  }, {
    timestamps: true,
    tableName: 'local_auth',
  });

  LocalAuth.associate = () => {
    if (app.model.Oauth) {
      app.model.User.hasMany(app.model.Oauth, { as: 'oauths', foreignKey: 'user_id' });
    }
    // User.hasOne(models.UserProfile, { as:'profile' });
    // User.belongsToMany(models.Role, { as:'roles', through: 'mc_userroles' });
    // User.hasOne(models.UserCheckin, { as:'checkin' });
  };

  // User.hashPassword = (passwordRaw, cb) => {
  //   // To speed up tests, we do a NODE_ENV check.
  //   // If we are in the test evironment we set the BCRYPT_COST = 1
  //   if (process.env.NODE_ENV === 'test') {
  //     BCRYPT_COST = 1;
  //   }
  //   // encrypt the password using bcrypt; pass the callback function
  //   // `fn` to bcrypt.hash()
  //   bcrypt.hash(passwordRaw, saltRounds, cb);
  // };
  // User.comparePasswordAndHash = (password, hash, cb) => {
  //   bcrypt.compare(password, hash, cb);
  // };

  return LocalAuth;
};
