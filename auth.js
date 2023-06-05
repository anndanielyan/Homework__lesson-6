import fs from 'fs';
import { Transform } from 'stream';

const inpOutFunction = function (inpPath, outPath, operation) {
  const readableStream = fs.createReadStream(inpPath);
  const writableStream = fs.createWriteStream(outPath);

  const transformData = new Transform({
    transform(chunk, encoding, callback) {
      let data = chunk.toString();

      switch (operation) {
        case 'uppercase':
          data = data.toUpperCase();
          break;
        case 'lowercase':
          data = data.toLowerCase();
          break;
        case 'reverse':
          data = data.split('').reverse().join('');
          break;
        default:
          throw new Error('Invalid operation');
      }

      this.push(data);
      callback();
    },
  });

  readableStream.pipe(transformData).pipe(writableStream);
  readableStream.on('error', () => {
    process.stdout.write('Error reading input file');
  });

  writableStream.on('error', () => {
    process.stdout.write('Error writing to output file');
  });

  transformData.on('error', () => {
    process.stdout.write('Some issue with streams');
  });

  writableStream.on('finish', () => {
    process.stdout.write('Operation finished succesfully');
  });
};

const argList = process.argv.slice(2);

if (argList[0] && argList[1] && argList[2]) {
  inpOutFunction(argList[0], argList[1], argList[2]);
} else {
  const exitHandler = function () {
    process.stdout.write('Missing arguments!');
    return process.exit();
  };
  exitHandler();
}
