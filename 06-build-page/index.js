const fs = require('fs');
const path = require('path');

async function getContent(filePath) {
  const promise = new Promise((resolve, reject) => {
    let info = '';
    const readFile = fs.createReadStream(filePath, { encoding: 'utf8' });
    readFile.on('data', (data) => {
      info += data;
    });
    readFile.on('end', () => {
      resolve(info);
    });
    readFile.on('error', (error) => {
      reject(error);
    });
  });
  return promise;
}

async function bundleCssFiles() {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err) => {
    console.log(err);
  });
  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  if (files.length > 0) {
    files.forEach(file => {
      const isCssFile = file.name.split('.').at(-1) === 'css';
      if (isCssFile) {
        const readStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
        readStream.pipe(writeStream);
      }
    });
  }
}

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

  async function removeFolders(pathFolder) {
    if (isFolderExist) {
      const foldersInCopyFolder = await fs.promises.readdir(pathFolder, { withFileTypes: true }, (err, data) => {
        if (err) {
          return console.log(err);
        }
        return data;
      });
      if (foldersInCopyFolder.length > 0) {
        for (let i = 0; i < foldersInCopyFolder.length; i += 1) {
          await removeFolders(path.join(pathFolder, `${foldersInCopyFolder[i].name}`));
        }
      } else {
        await fs.promises.rmdir(pathFolder, {}, () => { });
      }
    }
  }

  await removeFiles(pathFolderIntoStr);
  await removeFolders(pathFolderIntoStr);

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

async function buildPage() {
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
  let templatePage = await getContent(path.join(__dirname, 'template.html'));
  const templateTags = templatePage.match(/\{\{.+?\}\}/g);
  for (let i = 0; i < templateTags.length; i += 1) {
    const templateTag = templateTags[i];
    const tag = templateTag.replace(/\W/g, '');
    const templateTagRegExp = new RegExp(`${templateTag}`, 'g');
    const content = await getContent(path.join(__dirname, 'components', `${tag}.html`));
    templatePage = templatePage.replace(templateTagRegExp, content);
  }
  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
  writeStream.write(templatePage);
  await bundleCssFiles();
  await copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}



buildPage();