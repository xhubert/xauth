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
    url: `mongodb://xauth:${process.env.DB_PWD}@${process.env.DB_IP}:27017,${process.env.DB_IP}:27018,${process.env.DB_IP}:27019/${process.env.DB_NAME}?replicaSet=${process.env.DB_RS}`
  }

  config.console = {
    debug: false,
    error: false
  }

  return config
}
