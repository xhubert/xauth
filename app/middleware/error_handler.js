const sequelizeErrors = [
  'SequelizeBaseError',
  'SequelizeScopeError',
  'SequelizeValidationError', // 422 Unprocessable Entity（WebDAV；RFC 4918 ）请求格式正确，但是由于含有语义错误，无法响应。
  'SequelizeOptimisticLockError',
  'SequelizeDatabaseError',
  'SequelizeTimeoutError', // 408 Request Timeout
  'SequelizeUniqueConstraintError', // 422 Unprocessable Entity（WebDAV；RFC 4918 ）请求格式正确，但是由于含有语义错误，无法响应。
  'SequelizeForeignKeyConstraintError',
  'SequelizeExclusionConstraintError',
  'SequelizeUnknownConstraintError',
  'SequelizeConnectionError', // 406 Not Acceptable
  'SequelizeConnectionRefusedError', // 406 Not Acceptable
  'SequelizeAccessDeniedError', // 406 Not Acceptable
  'SequelizeHostNotFoundError',
  'SequelizeHostNotReachableError',
  'SequelizeInvalidConnectionError',
  'SequelizeConnectionTimedOutError',
  'SequelizeInstanceError',
  'SequelizeEmptyResultError',
  'SequelizeEagerLoadingError',
  'SequelizeAssociationError',
  'SequelizeQueryError',
  'SequelizeBulkRecordError'
]

const svrErrMsg = 'Internal Server Error'

module.exports = (option, app) => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      if (app.config.env === 'prod') {
        app.emit('error', err, ctx)
      }

      const error = {}

      if (!err.status && sequelizeErrors.includes(err.name)) {
        // 针对Sequelize异常的特殊处理
        // TODO: 需要持续丰富异常处理。
        switch (err.name) {
          case 'SequelizeValidationError':
          case 'SequelizeUniqueConstraintError':
            error.status = 422
            break
          case 'SequelizeTimeoutError':
            error.status = 408
            break
          case 'SequelizeConnectionError':
          case 'SequelizeConnectionRefusedError':
          case 'SequelizeAccessDeniedError':
            error.status = 406
            break
          default:
            break
        }
      } else {
        error.status = err.status || 500
      }

      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息。
      if (error.status === 500 && app.config.env === 'prod') {
        error.msg = svrErrMsg
      } else {
        error.msg = err.message || 'Unknown error!'
      }
      // 从 error 对象上读出各个属性，设置到响应中。
      ctx.body = { error }
      if (error.status === 422) {
        ctx.body.detail = err.errors
      }
      ctx.status = error.status
    }
  }
}
