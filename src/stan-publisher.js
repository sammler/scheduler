const Stan = require('node-nats-streaming');
const logger = require('winster').instance();

let stan = null;

// Const killStan = function() {
//   logger.trace('Caught interrupt signal');
//   if (stan) {
//     console.log(stan);
//     logger.trace('Close stan ...');
//     try {
//       stan.close();
//     }
//     catch (err) {
//       logger.error(`Closing stan results in an error: "${err}"`);
//     }
//   } else {
//     logger.trace('no stan to kill');
//   }
// };

class StanPublisher {

  constructor() {
    this.clusterId = 'test-cluster';
    this.clientId = 'scheduler_' + process.pid;

    // Process.on('SIGINT', killStan);
    // process.on('SIGUSR2', killStan); // nodemon restart
  }

  connect(clusterId, clientId, natsOpts) {

    const opts = Object.assign(natsOpts || {}, {
      json: true,
      reconnect: true,
      reconnectTimeWait: 2000,
      verbose: true,
      waitOnFirstConnect: true
    });

    return new Promise((resolve, reject) => {
      logger.trace('clientId', this.clientId);
      let stanInstance = Stan.connect(clusterId || this.clusterId, clientId || this.clientId, opts, function () {
        console.log('foo');
      });

      stanInstance.on('connect', function () {
        logger.trace('We are connected to stan.');
        stan = stanInstance;
        resolve(stanInstance);
      });

      stanInstance.on('close', function () {
        logger.trace('Connection to stan is closed.');
      });

      stanInstance.on('error', function (err) {
        logger.error(`Error connecting to Stan: "${err}"`);
        reject(err);
      });

      stanInstance.on('disconnect', function () {
        logger.trace('Disconnect to stan ...');
      });

      stanInstance.on('reconnect', function () {
        logger.trace('Reconnect to stan ...');
      });

      stanInstance.on('reconnecting', function () {
        logger.trace('Reconnecting to stan ...');
      });

    });
  }

  publish(subject, data, ackHandler) {
    if (stan) {
      stan.publish(subject, data, ackHandler);
    } else {
      this.logger.error('No instance of stan available');
      process.exit(1);
    }
  }
}

module.exports = StanPublisher;

