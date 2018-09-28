const nats = require('nats');
const logger = require('winster').instance();
const _ = require('lodash');
const schedule = require('node-schedule');
const config = require('./config/config');

checkRequiredEnv();

/**
 * Check required environment variables.
 */
function checkRequiredEnv() {
  if (_.isEmpty(config.NATS_URI)) {
    console.error('NATS_URI is not properly configured.');
    process.exit(1);
  }
}

if (config.LOAD_JOBS_FROM_FILE) {
  console.log(config.JOBS);

}



