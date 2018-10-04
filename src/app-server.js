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
    // this._logConfig();

    const killJobs = function() {
      logger.trace('OK, let\'s kill some left-overs:');
      if (this.cronJobs) {
        this.cronJobs.forEach(cronJob => {
          console.log('Cancelling cronJob: ', cronJob.name);
          cronJob.cancel();
        })
      }
    };

    process.on('SIGINT', killJobs);
    process.on('SIGUSR2', killJobs); // nodemon restart
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
  _init() {
    this.logger.trace('_init');
    this.stan = new StanPublisher();
    this.stan.connect();
    process.on('SIGINT', this.stan.kill);
    process.on('SIGUSR2', this.stan.kill);
    this._initSeededJobDefs();
  }

  _initSeededJobDefs() {
    this.logger.trace('_initSeededJobDefs');

    this.jobDefinitionSeedFiles = fileHelpers.getFiles(JOB_SEED_SRC);
    //logger.trace('jobDefinitionSeedFiles', this.jobDefinitionSeedFiles);

    this.jobDefinitions = JobLoader.fromFiles(this.jobDefinitionSeedFiles);
    //logger.trace('jobDefinitions', this.jobDefinitions);

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
      //this._nats.publish(currentJob.nats.subject, currentJob, () => {
      //  logger.trace(`OK, we have published a message triggered by the job: ${currentJob.name}`);
      //});

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
    this.logger.trace('start');
    this._init();
  }

  /**
   * Stops the app-server.
   *
   * This includes:
   *   - Stopping the running jobs.
   */
  async stop() {

  }
}

module.exports = AppServer;
