
const fs = require('fs');

const filename = process.argv[2];

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

console.log('lines:', lines.length);

let nblocks = [];
let proctime = [];

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    const p = line.indexOf('processed after:');
    
    if (p < 0)
        continue;
    
    const p2 = line.indexOf('[', p);
    
    const time = parseInt(line.substring(p2 + 1));
    
    const n = Math.floor(time / 5000000);
 
    if (!proctime[n])
        proctime[n] = 0;
    if (!nblocks[n])
        nblocks[n] = 0;
    
    proctime[n] += time;
    nblocks[n] ++;
}

console.log('no blocks', nblocks);
console.log('process time (ns)', proctime);

