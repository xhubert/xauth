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
    url: `mongodb://xauth:${process.env.DBPWD}@${process.env.IP}:27017,${process.env.IP}:27018,${process.env.IP}:27019/xauth?replicaSet=${process.env.DB_REPLICASET}`
  }

  config.console = {
    debug: false,
    error: false
  }

  return config
}
