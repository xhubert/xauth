module.exports = () => {
  const config = (exports = {})

  config.cluster = {
    listen: {
      port: 7007,
      hostname: '127.0.0.1',
      workers: 2
      // path: '/var/run/egg.sock',
    }
  }
  // mongoose配置
  config.mongoose = {
    // url: `mongodb://xauth:${process.env.DBPWD}@127.0.0.1:27017/xauth`,
    url: `mongodb://xauth:${process.env.DBPWD}@172.16.0.4:27017,172.16.0.4:27018,172.16.0.4:27019/xauth?replicaSet=cbbs-rs0`,
    options: {
      useNewUrlParser: true,
      poolSize: 20,
      keepAlive: true,
      useCreateIndex: true,
      autoReconnect: true,
      reconnectInterval: 1000,
      reconnectTries: Number.MAX_VALUE,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
  }

  config.console = {
    debug: false,
    error: false
  }

  return config
}
