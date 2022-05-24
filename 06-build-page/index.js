const fs = require('fs');
const {
  mkdir,
  constants
} = require('fs');
const {
  readdir,
  unlink,
  copyFile
} = require('fs/promises');
const path = require('path');

(async function () {
  // create folder
  await mkdir(path.join(__dirname, 'project-dist'), () => {
    console.log('The folder project-dist created');
  });
  // read template.html and save in variable
  try {
    const arrTemplate = [];
    let resultStrHTML = '';
    const files = await readdir(__dirname, {
      withFileTypes: true
    });
    await fs.writeFile(path.join(__dirname, 'project-dist/index.html'), '', () => {
      console.log('Cleaned index.html');
    });
    for (const file of files) {
      if (file.isFile() && file.name === 'template.html' && path.extname(file.name) === '.html') {
        // console.log(file.name);
        const steam = await fs.createReadStream(path.join(__dirname, file.name));
        steam.on('error', err => console.log(err));
        steam.on('data', (data) => {
          arrTemplate.push(data.toString());
        });
        steam.on('end', async () => {
          const arrFromTemplate = findIndexInTemplate(arrTemplate, 0);
          const pathFolder = path.join(__dirname, 'components');
          const filesTempl = await readdir(pathFolder, {
            withFileTypes: true
          });
          // create string for index.html
          resultStrHTML += arrTemplate[0].substring(0, arrFromTemplate[0].startIndex);
          arrFromTemplate.forEach(async (obj, i) => {
            // console.log(obj);
            for (const file of filesTempl) {
              if (file.name === `${obj.nameComponent}.html`) {
                // console.log(file.name);
                const steamRead = await fs.createReadStream(path.join(pathFolder, file.name));
                steamRead.on('data', (data) => {
                  resultStrHTML += data.toString();
                  if (arrFromTemplate[i + 1] !== undefined) {
                    resultStrHTML += arrTemplate[0].substring(obj.endIndex + 2, arrFromTemplate[i + 1].startIndex);
                  }
                });
                steamRead.on('end', async () => {
                  // write code in index.html
                  await fs.writeFile(path.join(__dirname, 'project-dist/index.html'), resultStrHTML, 'utf-8', () => {
                    console.log('Index.html created');
                  });
                });
              }
            }
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
})();

const result = [];

function findIndexInTemplate(arr, startPosition) {
  const startIndex = arr[0].indexOf('{{', startPosition);
  const endIndex = arr[0].indexOf('}}', startPosition);
  const nameComponent = arr[0].substring(startIndex + 2, endIndex);

  if (startIndex === -1) {
    return result;
  } else {
    result.push({
      startIndex,
      endIndex,
      nameComponent
    });

    return findIndexInTemplate(arr, endIndex + 1);
  }

}

// create style.css
(async function () {
  try {
    const pathStyleFolder = path.join(__dirname, 'styles');
    const files = await readdir(pathStyleFolder, {
      withFileTypes: true
    });
    await fs.writeFile(path.join(__dirname, 'project-dist/style.css'), '', () => {
      console.log('Cleaned style.css');
    });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const arrStyle = [];
        const steam = await fs.createReadStream(path.join(pathStyleFolder, file.name));
        steam.on('error', err => console.log(err));
        steam.on('data', (data) => {
          arrStyle.push(data);

          const pathBundle = path.join(__dirname, 'project-dist/style.css');
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

// copy folder

async function copyDir(folderForCopy, nameNewFolder) {
  const newFolderPath = path.join(__dirname, `project-dist/${nameNewFolder}`);
  await fs.promises.mkdir(newFolderPath, {
    recursive: true
  });
  console.log(folderForCopy);
  const copyFiles = await readdir(newFolderPath, {
    withFileTypes: true
  });
  console.log(copyFiles);
  for (const file of copyFiles) {
    if (file.isFile()) {
      await unlink(path.join(newFolderPath, file.name));
    }
    if (file.isDirectory()) {
      await copyDir(path.join(folderForCopy, file.name), `${nameNewFolder}/${file.name}`);
    }
  }

  const files = await readdir(folderForCopy, {
    withFileTypes: true
  });
  for (const file of files) {
    if (file.isFile()) {
      await copyFile(path.join(folderForCopy, file.name), path.join(newFolderPath, file.name), constants.COPYFILE_FICLONE);
    }

    if (file.isDirectory()) {
      console.log('fDir');
      console.log(file.name);
      await copyDir(path.join(folderForCopy, file.name), `${nameNewFolder}/${file.name}`);
    }
  }

  console.log('All files copied!');
}

copyDir(path.join(__dirname, 'assets'), 'assets');
