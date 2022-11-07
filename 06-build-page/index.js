const fsRW = require('fs');
const fs = require('fs/promises');
const path = require('path');

const fsWriteStream = fsRW.createWriteStream;
const fsReadStream = fsRW.createReadStream;

const destinationDirName = 'project-dist';
const assetsDirName = 'assets';
const stylesDirName = 'styles';
const componentsDirName = 'components';

const bundleCSSName = 'style.css';
const tamplateHTMLName = 'template.html';
const outputHTMLName = 'index.html';

const pathToDestinationDir = path.join(__dirname, destinationDirName);
const pathToAssetsDir = path.join(__dirname, assetsDirName);
const pathToStylesDir = path.join(__dirname, stylesDirName);
const pathToComponentsDir = path.join(__dirname, componentsDirName);
const pathToDestinationAssetsDir = path.join(pathToDestinationDir, assetsDirName);

const pathToDestinationStyleFile = path.join(pathToDestinationDir, bundleCSSName);
const pathToTamplateHTMLFile = path.join(__dirname, tamplateHTMLName);
const pathToOutputHTMLFile = path.join(pathToDestinationDir, outputHTMLName);

const makeDir = async (path) => {
  await fs.rm(path, { recursive: true, force: true });
  await fs.mkdir(path, { recursive: true });
}

const copyDir = async (source, destination) => {
  await fs.rm(destination, { recursive: true, force: true });
  await fs.mkdir(destination, { recursive: true });
  const files = await fs.readdir(source, { withFileTypes: true });

  for (const file of files) {
    const name = file.name;
    const src = path.join(source, name);
    const dest = path.join(destination, name);

    if (file.isFile()) {
      await fs.copyFile(src, dest);
    } else {
      await copyDir(src, dest);
    }
  }
}

const mergeStyles = async (sourceDirPath, destinationFilePath) => {
  const writeStream = fsWriteStream(destinationFilePath);
  const files = await fs.readdir(sourceDirPath, { withFileTypes: true });
  
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const pathToFile = path.join(sourceDirPath, file.name);
      const readStream = fsReadStream(pathToFile, 'utf8');
      readStream.pipe(writeStream);
    }
  }
}

const buildHTML = async (componentsDir, template, output) => {
  await fs.copyFile(template, output);
  let outputFile = await fs.readFile(output, 'utf-8');
  const writeStream = fsWriteStream(output);
  const files = await fs.readdir(componentsDir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(componentsDir, file.name);
    if (file.isFile() && path.extname(filePath) === '.html') {
      const fileName = path.parse(filePath).name;
      const component = await fs.readFile(filePath, 'utf-8');
      outputFile = outputFile.replace(`{{${fileName}}}`, component);
    }
  }

  writeStream.write(outputFile);
}

const main = async () => {
  await makeDir(pathToDestinationDir);
  await makeDir(pathToDestinationAssetsDir);
  await copyDir(pathToAssetsDir, pathToDestinationAssetsDir);
  await mergeStyles(pathToStylesDir, pathToDestinationStyleFile);
  await buildHTML(pathToComponentsDir, pathToTamplateHTMLFile, pathToOutputHTMLFile);

  console.log('Done!')
}

main();