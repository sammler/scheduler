const _ = require('lodash');                      // eslint-disable-line
const defaultConfig = require('./config/config'); // eslint-disable-line
const AppServer = require('./app-server');

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

const appServer = new AppServer(defaultConfig);
appServer.start();

