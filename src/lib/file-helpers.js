const fs = require('fs');

function getFiles(dir, files_) {
  files_ = files_ || [];
  let files = fs.readdirSync(dir);

  for (let file in files) {
    if ({}.hasOwnProperty.call(files, file)) {
      let name = dir + '/' + files[file];
      if (fs.statSync(name).isDirectory()) {
        getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
  }

  return files_;
}

module.exports = {
  getFiles
};
