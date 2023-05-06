const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const readline = require('readline');

const writeStream = fs.createWriteStream(path.join(__dirname, '/', 'text.txt'));

const myReadLine = readline.createInterface({
  input: stdin,
  output: stdout,
});

stdout.write('Hello, please, write your message:\n');

myReadLine.on('line', (line) => {
  if (line === 'exit') {
    return myReadLine.close();
  }
  writeStream.write(`${line}\n`);
});

myReadLine.on('close', () => {
  stdout.write('Thank you, goodbye!');
});


