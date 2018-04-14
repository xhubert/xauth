'use strict';

const version = 'v1';
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  // Tutorials
  router.resources('topic', '/api/v2/topics', 'topicCtrl');

  /**
   * The res of LocalAuth.
   */
  router.resources('localauth', `/api/${version}/localauth`, 'localAuthCtrl');
  router.patch(`/api/${version}/localauth/editusername/:uuid`, 'localAuthCtrl.editUserName');
  router.patch(`/api/${version}/localauth/editpassword/:uuid`, 'localAuthCtrl.editPassword');
};
