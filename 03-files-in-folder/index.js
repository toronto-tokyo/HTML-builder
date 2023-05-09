const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, '/', 'secret-folder'), { withFileTypes: true }, (err, data) => {
  if (err) {
    return console.log(err);
  }
  data.forEach(el => {
    if (el.isFile()) {
      const elPath = path.join(__dirname, '/secret-folder', el.name);
      const extname = path.extname(elPath);
      const name = el.name.split(extname).join('');
      fs.stat(elPath, (err, stats) => {
        if (err) {
          return console.log(err);
        }
        console.log(`${name}-${extname.slice(1)}-${stats.size}b`);
      });
    }
  });
});

