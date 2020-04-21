
const fs = require('fs');
const rlp = require('rlp');

const filename = process.argv[2];
const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

const nlines = lines.length;

for (let k = 0; k < nlines; k++) {
    const line = lines[k].trim();
    
    const elements = line.split(',');
    
    const block = elements[elements.length - 1];
    
    console.log(rlp.decode(Buffer.from(block, 'hex')));
}

