const Stan = require('node-nats-streaming');
const logger = require('winster').instance();

let stan;

class StanPublisher {

  constructor() {

  }

  kill() {
    logger.trace('Caught interrupt signal');
    if (stan) {
      stan.close();
    } else {
      logger.trace('no stan to kill');
    }
  }

  connect() {
    stan = Stan.connect('test-cluster', 'scheduler');
    stan.on('connect', function() {
      let logger = require('winster').instance();
      logger.trace('We are connected to stan.');

    });
    stan.on('close', function() {
      let logger = require('winster').instance();
      logger.trace('Connection to stan is closed.')
    });

  }

  publish() {

  }
}




module.exports = StanPublisher;


