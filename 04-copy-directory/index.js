const fs = require('fs');
const path = require('path');

async function copyDir(pathFolderFrom, pathFolderInto) {
  const pathFolderFromStr = pathFolderFrom;
  const pathFolderIntoStr = pathFolderInto;

  let isFolderExist;
  try {
    await fs.promises.access(pathFolderIntoStr);
    isFolderExist = true;
  } catch {
    isFolderExist = false;
  }


  async function removeFiles(pathFolder) {
    if (isFolderExist) {
      const filesInCopyFolder = await fs.promises.readdir(pathFolder, { withFileTypes: true }, (err, data) => {
        if (err) {
          return console.log(err);
        }
        return data;
      });
      if (filesInCopyFolder.length > 0) {
        for (let i = 0; i < filesInCopyFolder.length; i += 1) {
          if (filesInCopyFolder[i].isFile()) {
            await fs.promises.unlink(path.join(pathFolder, filesInCopyFolder[i].name), (err) => {
              if (err) console.log(err);
            });
          } else {
            await removeFiles(path.join(pathFolder, filesInCopyFolder[i].name));
          }
        }
      }
    }
  }

  await removeFiles(pathFolderIntoStr);
  if (isFolderExist) await fs.promises.rm(pathFolderIntoStr, { recursive: true, force: true }, () => { });

  async function copyFiles(pathFolderFromStr, pathFolderIntoStr) {
    await fs.promises.mkdir(pathFolderIntoStr, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
      }
    });
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
          copyFiles(path.join(pathFolderFromStr, el.name), path.join(pathFolderIntoStr, el.name));
        }
      });
    }
  }
  copyFiles(pathFolderFromStr, pathFolderIntoStr);
}

copyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));
