const fs = require('fs');
const {
  mkdir
} = require('fs');
const {
  readdir
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
    for (const file of files) {
      if (file.isFile() && file.name === 'template.html' && path.extname(file.name) === '.html') {
        console.log(file.name);
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
            console.log(obj);
            for (const file of filesTempl) {
              if (file.name === `${obj.nameComponent}.html`) {
                console.log(file.name);
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

// async function createHTMLFromTemplate(strHTML, arrReadFromHTML) {
//   const pathFolder = path.join(__dirname, 'components');
//   // let resultStrHTML = strHTML.substring(0, arrReadFromHTML[0].startIndex);
//   let resultStrHTML = '';
//   for (let i = 0; i < arrReadFromHTML.length; i++) {
//     const obj = arrReadFromHTML[i];
//     const files = await readdir(pathFolder, {
//       withFileTypes: true
//     });
//     console.log(i);
//     console.log(obj.nameComponent);
//     for (const file of files) {
//       const arrForSeparateTemplate = [];
//       if (file.isFile() && path.extname(file.name) === '.html') {
//         if (file.name === `${obj.nameComponent}.html`) {
//           const steam = await fs.createReadStream(path.join(pathFolder, file.name));
//           steam.on('error', err => console.log(err));
//           steam.on('data', (data) => {
//             arrForSeparateTemplate.push(data.toString());
//             // console.log(data.toString());
//           });
//           steam.on('end', () => {
//             resultStrHTML += arrForSeparateTemplate[0];
//             if (i !== arrReadFromHTML.length - 1) {
//               resultStrHTML += strHTML.substring(obj.endIndex + 2, arrReadFromHTML[i + 1].startIndex);
//             } else {
//               resultStrHTML += strHTML.substring(obj.endIndex + 2);
//             }
//             // console.log(resultStrHTML);
//             return resultStrHTML;
//           });
//         }
//       }
//     }
//   }
// }
