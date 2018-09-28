module.export = {
  NATS_URI: process.env.NATS_URI,
  nodeEnv: process.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  LOAD_JOBS_FROM_FILE: process.env.LOAD_JOBS_FROM_FILE || false,
  JOB_FILES: process.env.JOB_FILES
};
