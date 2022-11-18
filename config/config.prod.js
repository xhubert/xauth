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
  
  config.console = {
    debug: false,
    error: false
  }

  return config
}
