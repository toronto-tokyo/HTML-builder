const fs = require('fs');
const path = require('path');

async function copyDir(pathFolderFrom, pathFolderInto) {
  const pathFolderFromStr = pathFolderFrom;
  const pathFolderIntoStr = pathFolderInto;
  await fs.promises.mkdir(pathFolderIntoStr, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }
  });
  const filesInCopyFolder = await fs.promises.readdir(pathFolderIntoStr, { withFileTypes: true }, (err, data) => {
    if (err) {
      return console.log(err);
    }
    return data;
  });
  if (filesInCopyFolder.length > 0) {
    filesInCopyFolder.forEach(el => {
      fs.unlink(path.join(pathFolderIntoStr, el.name), (err) => {
        if (err) console.log(err);
      });
    });
  }
  async function copyFiles() {
    const files = await fs.promises.readdir(pathFolderFromStr, { withFileTypes: true }, (err, data) => {
      if (err) {
        return console.log(err);
      }
      return data;
    });
    if (files.length > 0) {
      files.forEach(el => {
        if (el.isFile()) {
          fs.copyFile(path.join(pathFolderFromStr, el.name), path.join(pathFolderIntoStr, el.name), (err) => {
            if (err) {
              return console.log(err);
            }
          });
        } else {
          copyDir(path.join(pathFolderFromStr, el.name), path.join(pathFolderIntoStr, el.name));
        }
      });
    }
  }
  copyFiles();
}

copyDir(path.join(__dirname, '/', 'files'), path.join(__dirname, '/', 'files-copy'));

