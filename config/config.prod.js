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
    url: `mongodb://xauth:${process.env.DBPWD}@${process.env.IP}:27017,${process.env.IP}:27018,${process.env.IP}:27019/xauth?replicaSet=cbbs-rs0`
  }

  config.console = {
    debug: false,
    error: false
  }

  return config
}
