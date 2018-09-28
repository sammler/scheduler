const defaultConfig = require('./config/config');

class AppServer {

  constructor(config) {
    this.config = Object.assign(defaultConfig, config);
    // This._logConfig();
  }

  _logConfig() {
    console.log('\n~~');
    console.log(`NODE_ENV: ${this.config.NODE_ENV}`);
    console.log(`PORT: ${this.config.PORT}`);
  }

  start() {

  }

  stop() {

  }

}

module.exports = AppServer;
