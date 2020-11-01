
const fs = require('fs');
const rlp = require('rlp');

const filename = process.argv[2];
const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

const nlines = lines.length;

const counts = [];
let nblocks = 0;

const miners = {};

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
    
    const coinbase = parts[0][2].toString('hex');
    
    if (!miners[coinbase])
        miners[coinbase] = 0;
    
    miners[coinbase]++;
}

console.log(JSON.stringify(miners, null, 4));



