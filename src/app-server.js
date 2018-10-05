const defaultConfig = require('./config/config');
const logger = require('winster').instance();
const path = require('path');
const fileHelpers = require('./lib/file-helpers');
const JobLoader = require('./job-loader');
const schedule = require('node-schedule');
const uuidv1 = require('uuid/v1');

const StanPublisher = require('./stan-publisher');

const JOB_SEED_SRC = path.resolve(__dirname, './config/job-seeds');

class AppServer {

  constructor(config) {
    this.config = Object.assign(defaultConfig, config);
    this.logger = logger;
    this.jobDefinitionSeedFiles = [];
    this.jobDefinitions = [];
    this.cronJobs = [];
    this._logConfig();

    const killJobs = function () {
      logger.trace('OK, let\'s kill some left-overs:');
      if (this.cronJobs) {
        this.cronJobs.forEach(cronJob => {
          console.log('Cancelling cronJob: ', cronJob.name);
          cronJob.cancel();
        });
      }
    };

    process.on('SIGINT', killJobs);
    process.on('SIGUSR2', killJobs); // Nodemon restart
  }

  _logConfig() {
    this.logger.trace('\n~~');
    this.logger.trace(`NODE_ENV: ${this.config.NODE_ENV}`);
    this.logger.trace(`PORT: ${this.config.PORT}`);
    this.logger.trace(`JOB_SEED_SRC: ${JOB_SEED_SRC}`);
  }

  /**
   * Initializes the scheduled jobs.
   * @private
   */
  async _init() {
    this._initSeededJobDefs();
    await this._initStan();
  }

  async _initStan() {

    let stanPublisher = new StanPublisher();
    let natsOpts = {
      uri: defaultConfig.NATS_URI || 'nats://localhost:4222'
    };
    console.log(`_initStan:natsOpts: ${natsOpts}`);
    try {
      this.stan = await stanPublisher.connect(null, null, natsOpts);
    } catch (err) {
      this.logger.error(`Error initializing stan: "${err}"`);
      process.exit(1);
    }
  }

  _initSeededJobDefs() {
    this.logger.trace('_initSeededJobDefs');

    this.jobDefinitionSeedFiles = fileHelpers.getFiles(JOB_SEED_SRC);
    this.jobDefinitions = JobLoader.fromFiles(this.jobDefinitionSeedFiles);
    this.logger.trace(`_initSeededJobDefs:jobDefinitions: ${this.jobDefinitions}`);

    this._initJobs();
  }

  _initJobs() {
    this.logger.trace('_initJobs');

    this.jobDefinitions.forEach(job => {
      if (job.strategy === 'cron' && job.enabled === true) {
        this._initCronJob(job);
      }
    });
  }

  _initCronJob(job) {
    // Todo: we have to validate the job here ...
    let j = schedule.scheduleJob(job.cron.def, o => {
      let currentJob = job;
      currentJob.trace_id = uuidv1();
      currentJob.ts_pub = o;
      logger.trace(`OK, a job has been triggered (by cron): ${currentJob.name}`);

      if (this.stan) {
        this.stan.publish(currentJob.nats.subject, JSON.stringify(currentJob.data), (err, guid) => {
          logger.trace('--');
          logger.trace(`OK, we have published a message triggered by the job ${currentJob.name}`);
          if (err) {
            logger.trace(`Error returned from stan: "${err}"`);
          } else {
            logger.trace(`Guid returned from stan: "${guid}"`);
          }
        });
      } else {
        logger.error('We have received a job, but stan is not ready');
      }
    });
    process.on('SIGINT', function () {
      if (j) {
        logger.trace('Killing job', j.name);
        j.cancel();
      }
    });
    this.cronJobs.push(j);
  }

  /**
   * Starts the app-server.
   *
   * This includes:
   *   - Initializing the jobs.
   */
  async start() {
    this.logger.trace('Starting the appServer ...');
    await this._init();
  }

  /**
   * Stops the app-server.
   *
   * This includes:
   *   - Stopping the running jobs.
   */
  async stop() {
    this.logger.trace('Stopping the appServer ...');
  }
}

module.exports = AppServer;
