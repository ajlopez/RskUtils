
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
    return line.indexOf('Get Task') >= 0 ||
           line.indexOf('Start Task') >= 0 ||
           line.indexOf('End Task') >= 0 ||
           line.indexOf('Process message') >= 0 ||
           line.indexOf('processed after') >= 0;
}

