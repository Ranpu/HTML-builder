const fs = require('fs/promises');
const path = require('path');

const originalDir = 'files';
const NewDir = 'files-copy';

const pathToOriginalDir = path.join(__dirname, originalDir);
const pathToNewDir = path.join(__dirname, NewDir);

const makeNewDir = async (pathToNewDir) => {
  await fs.rm(pathToNewDir, { recursive: true, force: true });
  await fs.mkdir(pathToNewDir, { recursive: true });
}

const copyFiles = async (pathToOriginalDir, pathToNewDir) => {
  const files = await fs.readdir(pathToOriginalDir);

  for (let file of files) {
    await fs.copyFile(path.join(pathToOriginalDir, file), path.join(pathToNewDir, file));
  }
}

const main = async () => {
  await makeNewDir(pathToNewDir);
  await copyFiles(pathToOriginalDir, pathToNewDir);
  console.log('Done!');
}

main();