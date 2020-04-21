
const fs = require('fs');
const rlp = require('rlp');

const filename = process.argv[2];
const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

const nlines = lines.length;

const counts = [];
let nblocks = 0;

for (let k = 0; k < nlines; k++) {
    const line = lines[k].trim();
    
    if (!line.length)
        continue;
    
    nblocks++;
    
    const elements = line.split(',');
    
    const block = elements[elements.length - 1];

    const parts = rlp.decode(Buffer.from(block, 'hex'));
    
    if (!parts.length)
        continue;
    
    for (let j = 0; j < parts[0].length; j++)
        if (parts[0][j] instanceof Buffer)
            counts[j] = (counts[j] || 0) + parts[0][j].length;
}

console.log(nblocks);
console.log(counts);

let tsize = 0;

for (let k = 0; k < counts.length; k++)
    tsize += counts[k];

console.log(tsize);


