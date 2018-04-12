'use strict';

const version = 'v1';

const mock = require('egg-mock');

describe('test/app/controller/localAuthCtrl.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });

  afterEach(mock.restore);

  it('should POST /api/v1/localauth/ 422', async () => {
    app.mockCsrf();
    const err = new Error('validation failed');
    err.status = 422;
    app.mockService('localAuth', 'create', err);
    await app.httpRequest()
      .post(`/api/${version}/localauth`)
      .send({
        username: 'test2',
      })
      .expect(422)
      .expect({
        error: 'Validation Failed',
        detail: [
          { message: 'required', field: 'password', code: 'missing_field' },
        ],
      });
  });

  it('should POST /api/v2/localauth/ 201', async () => {
    app.mockCsrf();
    app.mockService('localAuth', 'create', 123);
    await app.httpRequest()
      .post(`/api/${version}/localauth`)
      .send({
        username: '123',
        password: 'title22',
      })
      .expect(201)
      .expect({
        id: 123,
      });
  });
});
