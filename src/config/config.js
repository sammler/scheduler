module.exports = {
  NATS_URI: process.env.NATS_URI || 'nats://localhost:4222',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  LOAD_JOBS_FROM_FILE: process.env.LOAD_JOBS_FROM_FILE || false,
  JOB_FILES: process.env.JOB_FILES
};
