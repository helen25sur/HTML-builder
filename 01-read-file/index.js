const fs = require('fs');
const path = require('path');

(async function () {
  return new Promise((resolve, reject) => {
    const steam = fs.createReadStream(path.join(__dirname, 'text.txt'));
    steam.on('error', err => reject(err));
    steam.on('data', (data) => {
      console.log(data.toString());
      resolve(data);
    });
    steam.on('end', () => {
      console.log('Reading of file ended');
    });
  });
})();
