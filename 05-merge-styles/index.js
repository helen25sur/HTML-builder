const fs = require('fs');
const {
  readdir
} = require('fs/promises');
const path = require('path');

const pathStyleFolder = path.join(__dirname, 'styles');

(async function () {
  try {
    const files = await readdir(pathStyleFolder, {
      withFileTypes: true
    });
    await fs.writeFile(path.join(__dirname, 'project-dist/bundle.css'), '', () => {
      console.log('Cleaned bundle.css');
    });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const arrStyle = [];
        const steam = await fs.createReadStream(path.join(pathStyleFolder, file.name));
        steam.on('error', err => console.log(err));
        steam.on('data', (data) => {
          arrStyle.push(data);

          const pathBundle = path.join(__dirname, 'project-dist/bundle.css');
          const steamWrite = fs.createWriteStream(pathBundle, 'utf-8');

          steamWrite.on('open', () => {
            fs.writev(0, arrStyle, () => {
              fs.appendFile(pathBundle, arrStyle.toString(), () => {
                console.log('Styles added to the bundle.css');
              });
            });
          });
          steamWrite.on('end', () => {
            steamWrite.end();
          });
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
