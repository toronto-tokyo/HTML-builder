const fs = require('fs');
const path = require('path');

async function bundleCssFiles() {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err) => {
    console.log(err);
  });
  const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
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

bundleCssFiles();