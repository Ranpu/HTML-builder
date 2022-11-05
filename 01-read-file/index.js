const fs = require('fs');
const path = require('path');
const process = require('process');

const stdout = process.stdout;
const fileName = `text.txt`;
const pathToFile = path.join(__dirname, fileName);
const readStream = fs.createReadStream(pathToFile, { encoding: 'utf-8' });
const chunks = [];

readStream.on('error', err => console.error(`Error: ${err}`));
readStream.on('data', chunk => chunks.push(chunk));
readStream.on('end', () => stdout.write(`${chunks.join('')}\n`));