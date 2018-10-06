const _ = require('lodash');                      // eslint-disable-line
const defaultConfig = require('./config/config'); // eslint-disable-line
const AppServer = require('./app-server');
const logger = require('winster').instance();

const appServer = new AppServer(defaultConfig);
checkRequiredEnv();

/**
 * Check required environment variables.
 */
function checkRequiredEnv() {
  return true;
  // If (_.isEmpty(defaultConfig.NATS_URI)) {
  //   console.error('NATS_URI is not properly configured.');
  //   process.exit(1);
  // }
}

(async () => {
  try {
    await appServer.start();
  } catch (err) {
    logger.trace(`Cannot start appServer: ${err}`);
  }
})();

