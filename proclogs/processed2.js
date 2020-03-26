
const fs = require('fs');

const filename = process.argv[2];

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

console.log('lines:', lines.length);

let nblocks = 0;
let proctime = 0;

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    const p = line.indexOf('processed after');
    
    if (p < 0)
        continue;
    
    const p2 = line.indexOf('[', p);
    
    const time = parseInt(line.substring(p2 + 1));
    
    if (time > 5000000)
        continue;
    
    proctime += time;
    nblocks++;
}

console.log('no blocks', nblocks);
console.log('process time (ns)', proctime);

