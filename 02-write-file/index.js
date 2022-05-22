const fs = require('fs');
const path = require('path');
const process = require('process');
const {
  stdin
} = require('process');
const pathFile = path.join(__dirname, 'write.txt');

fs.writeFile(pathFile, '', () => {
  console.log('File write.txt created');
  const steam = fs.createWriteStream(pathFile, 'utf-8');
  steam.on('open', () => {
    console.log('Hello! Enter your message!');

    stdin.on('data', data => {
      if (data.toString().trim() === 'exit') {
        console.log('Thanks! Have a nice day!');
        steam.end();
        process.exit();
      }
      console.log(`You typed ${data.toString()}`);
      fs.appendFile(pathFile, data.toString(), () => {
        console.log('Your message wrote in the file write.txt');
      });

    });
  });
  steam.on('end', () => {
    steam.end();
  });
});
process.on('SIGINT', () => {
  console.log('Thanks! Have a nice day!');
  process.exit();
});
