const process = require('process');
const path = require('path');
const readline = require('readline');
const fs = require('fs');

const newFileName = 'text.txt';

const output = process.stdout;
const input = process.stdin;
const pathToFile = path.join(__dirname, newFileName);
const toFile = fs.createWriteStream(pathToFile, { flags: 'a' });

const readLine = readline.createInterface({ input: input, output: output });

let count = 0;

output.write(`File ${newFileName} has been created!\nEnter your text:\n> `);
fs.createWriteStream(pathToFile).write('');

readLine.on('line', text => {
  if (text === 'exit') process.exit();
  count > 0 ? toFile.write(`\n${text}`) : toFile.write(`${text}`);
  count++;
  output.write('> ');
});

process.on('exit', () => {
  output.cursorTo(0);
  output.write(`See ya!\n`);
});