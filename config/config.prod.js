module.exports = () => {
  const config = exports = {}

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '127.0.0.1',
      workers: 2
      // path: '/var/run/egg.sock',
    }
  }
  // mongoose配置
  config.mongoose = {
    url: `mongodb://xauth:${process.env.DBPWD}@127.0.0.1:27017/xauth`,
    options: {
      useNewUrlParser: true,
      poolSize: 20,
      keepAlive: true,
      // useCreateIndex: true,
      autoReconnect: true,
      reconnectInterval: 1000,
      reconnectTries: Number.MAX_VALUE,
      useFindAndModify: false
    }
  }

  config.console = {
    debug: false,
    error: false
  }

  return config
}
