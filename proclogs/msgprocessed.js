
const fs = require('fs');

const filename = process.argv[2];

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

console.log('lines:', lines.length);

let nmessages = 0;
let proctime = 0;
let maxtime = 0;

const results = {};

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    const p = line.indexOf('processed after ');
    
    if (p < 0)
        continue;
    
    const p2 = line.indexOf('[', p);
    
    const time = parseInt(line.substring(p2 + 1));
    
    if (time > maxtime) {
        console.log(time, line);
        maxtime = time;
    }
    
    const p3 = line.indexOf('Message[');
    const p4 = line.indexOf(']', p3);
    const type = line.substring(p3 + 'Message['.length, p4);
    
    if (!results[type])
        results[type] = [ 0, 0, 0 ];
    
    results[type][0]++;
    results[type][1] += time;
    
    if (time > results[type][2])
        results[type][2] = time;

    proctime += time;
    nmessages++;
}

console.log('no messages', nmessages);
console.log('process time (ms)', proctime / 1000000);
console.log('max time (ms)', maxtime / 1000000);

console.dir(results);