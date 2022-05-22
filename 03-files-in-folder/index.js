const {
  readdir,
  stat
} = require('fs/promises');
const path = require('path');

const pathFolder = path.join(__dirname, 'secret-folder');

(async function () {
  try {
    const files = await readdir(pathFolder, {
      withFileTypes: true
    });
    for (const file of files) {
      if (file.isFile()) {
        const statFile = await stat(path.join(pathFolder, file.name));
        const nameWithoutExt = file.name.slice(0, file.name.indexOf('.'));
        console.log(`${nameWithoutExt} - ${path.extname(file.name)} - ${statFile.size}b`);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
