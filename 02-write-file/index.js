const fs = require('fs');
const path = require('path');
// const process = require('process');
const readline = require('readline/promises');

const writeStr = fs.createWriteStream(path.join(__dirname, 'write.txt'), 'utf-8');
writeStr.on('writable', () => {
  console.log(`Please, enter your message: ${writeStr.write()}`);
  // readline
});
writeStr.on('writableEnded', () => {
  console.log('Thank you! Have a nice day!');
});
