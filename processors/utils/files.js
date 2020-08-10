const fs = require('fs');
const path = require('path');

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd());
  },

  getRepoSettingsFilePath: (fileName) => {
    return path.resolve(this.getCurrentDirectoryBase,fileName)
  },

  directoryExists: (filePath) => {
    return fs.existsSync(filePath);
  },

  fileInDirectoryExists: (fileName) => {
    return fs.existsSync(path.resolve(process.cwd(), fileName))
  }
};
