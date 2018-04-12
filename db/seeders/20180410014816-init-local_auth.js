'use strict';


const uuid = require('../../app/lib/uuid');
const initIds = [ 1, 2, 3, 4, 5 ];
const initUuIds = [
  uuid.shortId(), uuid.shortId(),
];

const crypto = require('../../app/lib/crypto');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('local_auth', [{
      id: initIds[0],
      uuid: initUuIds[0],
      username: 'test',
      password: crypto.encryptWithSalt('123456'), // 不能少于6位数
      status: '1',
      createdAt: Sequelize.fn('NOW'),
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      'local_auth',
      { id: { [ Op.in ]: initIds } },
      {}
    );
  },
};
