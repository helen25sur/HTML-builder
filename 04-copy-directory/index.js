const constants = require('fs');
const {
  mkdir,
  unlink,
  copyFile,
  readdir
} = require('fs/promises');
const path = require('path');

const folderDefault = path.join(__dirname, 'files');

async function copyDir(folderForCopy) {
  const newFolderPath = path.join(__dirname, 'files-copy');
  await mkdir(newFolderPath, {
    recursive: true
  });

  const copyFiles = await readdir(newFolderPath, {
    withFileTypes: true
  });
  for (const file of copyFiles) {
    if (file) {
      await unlink(path.join(newFolderPath, file.name));
    }
  }

  const files = await readdir(folderForCopy, {
    withFileTypes: true
  });
  for (const file of files) {
    await copyFile(path.join(folderForCopy, file.name), path.join(newFolderPath, file.name), constants.COPYFILE_FICLONE);
  }
  console.log('All files copied!');
}

copyDir(folderDefault);
