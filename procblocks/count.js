
const fs = require('fs');
const rlp = require('rlp');

const filename = process.argv[2];
const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

const nlines = lines.length;

let tsize = 0;
let nblocks = 0;
let ntransactions = 0;
let nuncles = 0;
let nunclessamem = 0;

for (let k = 0; k < nlines; k++) {
    const line = lines[k].trim();
    
    if (!line.length)
        continue;
    
    nblocks++;

    const parts = line.split(',');
    
    const block = parts[parts.length - 1];
    
    tsize += block.length / 2;
    
    const bparts = rlp.decode(Buffer.from(block, 'hex'));
    
    const coinbase = bparts[0][2].toString('hex');

    ntransactions += bparts[1].length;
    nuncles += bparts[2].length;
    
    for (let j = 0; j < bparts[2].length; j++) {
        const ucoinbase = bparts[2][j][2].toString('hex');
        
        if (coinbase === ucoinbase)
            nunclessamem++;
    }
}

console.log("no blocks", nblocks);
console.log("no transactions", ntransactions);
console.log("average no transactions per block", ntransactions / nblocks);
console.log("no uncles", nuncles);
console.log("average no uncles per block", nuncles / nblocks);
console.log("no uncles same miner", nunclessamem);
console.log("total size (bytes)", tsize);
console.log("block average size (bytes)", tsize / nblocks);


