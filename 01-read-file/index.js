const fs = require('fs');
const path = require('path');

const absolutePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(absolutePath, { encoding: 'utf8' });
readStream.on('data', (data) => console.log(data));

