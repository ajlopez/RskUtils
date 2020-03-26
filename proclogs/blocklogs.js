
const fs = require('fs');

const filename = process.argv[2];

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    
    if (isBlockLine(line))
        console.log(line);
}

function isBlockLine(line) {
    return line.indexOf('[blockchain') >= 0 ||
           line.indexOf('[blockvalidator') >= 0 ||
           line.indexOf('[blockexecutor') >= 0 ||
           line.indexOf('[execute') >= 0;
}

