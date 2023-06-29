const fs = require('fs');
const path = require('path');

const readFile = function readFile(filePath) {
    try {
        let resolvePath = path.resolve(filePath);
        let fileContents;
        fileContents = fs.readFileSync(resolvePath, 'utf-8');
        return fileContents;
    } catch (err) {
        return "";
    }
}

module.exports = readFile;