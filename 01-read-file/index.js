// const fs = require('fs');
// const path = require('path');

// fs.readFile(path.join(__dirname, 'text.txt'), 'utf8', function (error, data) {
//   if (error) throw error;
//   console.log(data.toString());
// });

const fs = require('fs');
const path = require('path');

const rr = fs.createReadStream(path.join(__dirname, 'text.txt'));
rr.on('readable', () => {
  console.log(`readable: ${rr.read()}`);
});
rr.on('end', () => {
  console.log('The reading ended');
});
