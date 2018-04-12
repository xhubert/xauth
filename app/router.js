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

  router.post(`/api/${version}/localauth`, 'localAuthCtrl.create');
};
