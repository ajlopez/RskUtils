
const fs = require('fs');

const count = [];

for (let k = 0; k < 16; k++)
    count['0123456789abcdef'[k]] = 0;

const filename = process.argv[2];
const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

const nlines = lines.length;

let tsize = 0;

for (let k = 0; k < nlines; k++) {
    const line = lines[k].trim();
    
    const parts = line.split(',');
    
    const block = parts[parts.length - 1];
    
    tsize += block.length;
    
    for (let j = 0; j < block.length; j++)
        count[block[j]]++;
}

console.dir(lines.length);
console.dir(tsize);
console.dir(count);

