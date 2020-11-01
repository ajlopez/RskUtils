
const fs = require('fs');
const rlp = require('rlp');
const keccak256 = require('./sha3').keccak_256;

const filename = process.argv[2];
const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

const nlines = lines.length;

const counts = [];
let nblocks = 0;

const miners = {};
const processed = {};

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
    
    const hash = pseudoHash(parts[0]);
    
    processHeader(parts[0], hash);
    
    for (let k = 0; k < parts[2].length; k++) {
        const uncle = parts[2][k];
        const hash = pseudoHash(uncle);
        
        processHeader(uncle, hash);
    }
}

console.log(JSON.stringify(miners, null, 4));

function processHeader(header, hash) {
    if (processed[hash])
        return;
    
    processed[hash] = true;
    
    const coinbase = header[2].toString('hex');
    
    if (!miners[coinbase])
        miners[coinbase] = 0;
    
    miners[coinbase]++;
}

function pseudoHash(header) {
    let str = '';
    
    for (let k = 0; k < header.length; k++)
        str += header[k].toString('hex');
    
    return keccak256(str);
}

