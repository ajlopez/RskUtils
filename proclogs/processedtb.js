
// processed trace block

const fs = require('fs');

const filename = process.argv[2];

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

let totalTime = 0;
let ntraces = 0;

let fromTime;
let toTime;

let initTime;
let endTime;

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    
    if (line.startsWith('20')) {
        const lineTime = toDate(getTime(line));
        
        endTime = lineTime;
        
        if (!initTime)
            initTime = lineTime;
    }
    
    const p = line.indexOf('Invoking method: trace_block');
    
    if (p > 0) {
        fromTime = toDate(getTime(line));
        continue;
    }
    
    const p2 = line.indexOf('Invoked method: trace_block');
    
    if (p2 < 0)
        continue;
    
    toTime = toDate(getTime(line));
    
    if (!fromTime)
        continue;
    
    totalTime += toTime - fromTime;
    ntraces++;
}

console.log('no trace blocks', ntraces);
console.log('process time (ms)', totalTime);
console.log('average time (ms)', totalTime / ntraces);
console.log('log time (ms)', endTime - initTime);
console.log('average velocity (ms)', (endTime - initTime) / ntraces);

function toDate(time) {
    return new Date(time.substring(0, 10) + ' ' + time.substring(11));
}

function getTime(line) {
    return line.substring(0, 23);
}

