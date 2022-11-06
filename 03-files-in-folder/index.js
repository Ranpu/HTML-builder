const path = require('path');
const fs = require('fs');

const targetFolder = 'secret-folder';
const pathToFiles = path.join(__dirname, targetFolder);

fs.readdir(pathToFiles, { withFileTypes: true }, (err, files) => {
  if (err) throw new Error(err);
  files.filter(file => file.isFile()).forEach(val => {
    fs.stat(path.join(pathToFiles, val.name), (err, data) => {
      if (err) throw new Error(err);
      const size = Math.round(data.size / 1024 * 10) / 10;
      console.log(`${path.parse(val.name).name}\t- ${path.extname(val.name).substring(1)}\t- ${size}KiB`);
    });
  });
});