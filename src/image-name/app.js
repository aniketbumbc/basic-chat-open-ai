const fs = require('fs');
const directoryPath = '';
const { join } = require('path/posix');
const { writeFileSync } = require('fs');
const fileList = fs.readdirSync(directoryPath);

const demo = fileList.map((file, index) => {
  return {
    id: index + 1,
    name: file,
  };
});

const dataString = JSON.stringify(demo);
const dataBuffer = Buffer.from(dataString);
const path = join(__dirname, 'imageName.json');
writeFileSync(path, dataBuffer);
