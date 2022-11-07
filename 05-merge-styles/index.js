const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const bundleCSS = 'bundle.css';
const sourceDir = 'styles';
const destinationDir = 'project-dist';

const pathToSourceDir = path.join(__dirname, sourceDir);
const pathToDestinationDir = path.join(__dirname, destinationDir);
const pathToBundleCSS = path.join(pathToDestinationDir, bundleCSS);

const getListOfFiles = async (sourceDir) => {
  const files = await readdir(sourceDir, { withFileTypes: true });
  return files.filter(file => file.isFile() && path.extname(file.name) === '.css');
}

const main = async () => {
  const files = await getListOfFiles(pathToSourceDir);
  const writeStream = fs.createWriteStream(pathToBundleCSS);

  for (let file of files) {
    const pathToSourceFile = path.join(pathToSourceDir, file.name);
    const readStream = fs.createReadStream(pathToSourceFile, 'utf8');
    readStream.pipe(writeStream);
  }
}

main();