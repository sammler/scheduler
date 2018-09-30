const JobLoader = require('./../../src/job-loader');
const path = require('path');

describe('Unit Test => job-loader', () => {
  it('has static method `fromFiles()`', () => {
    expect(JobLoader).to.has.property('fromFiles').to.be.a('function');
  });

  describe('`fromFiles`', () => {
    it('returns an error if no file has been passed', () => {
      expect(() => JobLoader.fromFiles()).to.throw(/Property `files` cannot be empty./);
    });
    it('returns an empty array if an empty array of files is passed ...', () => {
      let result = JobLoader.fromFiles([]);
      expect(result).to.be.an('array').of.length(0);
    });
    it('throws an error if one of the files do not exist', () => {
      let files = [
        path.resolve(path.join(__dirname, './../fixtures/jobs/does-not-exist.yml'))
      ];
      expect(() => JobLoader.fromFiles(files)).to.throw(/File does not exist./);
    });
    it('properly handles one file and returns a job array', () => {
      let files = [
        path.resolve(path.join(__dirname, './../fixtures/jobs/jobs-1.yml'))
      ];
      let result;
      try {
        result = JobLoader.fromFiles(files);
      } catch (err) {
        if (err) {
          console.log(err);
        }
        expect(err).to.not.exist;
      }
      expect(result).to.be.an('array').of.length(2);
    });

    it('properly handles n files and returns a job array', () => {
      let files = [
        path.resolve(path.join(__dirname, './../fixtures/jobs/jobs-1.yml')),
        path.resolve(path.join(__dirname, './../fixtures/jobs/jobs-2.yml'))
      ];

      let result;
      try {
        result = JobLoader.fromFiles(files);
      } catch (err) {
        expect(err).to.not.exist;
      }
      expect(result).to.be.an('array').of.length(5);
    });
  });
});
