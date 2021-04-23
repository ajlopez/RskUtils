
const fs = require('fs');

const filename = process.argv[2];
const nms = process.argv[3] ? parseInt(process.argv[3]) : 1000;

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    const words = line.split(',');
    
    const time = parseInt(words[3]);
    
    if (time < nms)
        continue;
        
    console.log(line);
}
