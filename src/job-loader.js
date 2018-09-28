const fs = require('fs');
const yaml = require('js-yaml');

/**
 * Loads jobs from one or more files or from DB.
 */
class JobLoader {

  /**
   * Load jobs from files.
   *
   * @param {Array<string>} files - Array of files to load jobs from.
   * @return {Array<object>} jobs - Jobs loaded.
   */
  static fromFiles(files) {

    if (!files || !Array.isArray(files)) {
      throw new Error('Property `files` cannot be empty and must be an array.');
    }

    let jobs = [];
    files.forEach(filePath => {
      if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist: ' + filePath);
      }
      let jobsInFile = yaml.safeLoad(fs.readFileSync(filePath, 'utf8')).jobs;
      jobsInFile.forEach(job => {
        jobs.push(job);
      });


    });


    return jobs;
  }

}

module.exports = JobLoader;
