
const fs = require('fs');

const filename = process.argv[2];
const nmintxs = process.argv[3] ? parseInt(process.argv[3]) : 0;

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    
    if (line.indexOf("processed after:") < 0)
        continue;
    if (line.indexOf('EXIST') >= 0)
        continue;
        
    const datetime = getTime(line);
    const logtime = toDate(datetime);
        
    const p = line.indexOf("processed after: [");
    let time = line.substring(p + "processed after: [".length);
    const p2 = time.indexOf("]");
    time = time.substring(0, p2);
        
    if (time.indexOf('.') >= 0)
        time = Math.floor(parseFloat(time) * 1_000_000_000);
    else
        time = parseInt(time);
               
    const proctime = Math.floor((time + 500000) / 1000000);
    
    const pb = line.indexOf("num: [");
    let number = line.substring(pb + "num: [".length);
    const pb2 = number.indexOf("]");
    number = number.substring(0, pb2);
    
    const blocknumber = parseInt(number);
    
    console.log(datetime + "," + logtime.getTime() + "," + blocknumber + "," + proctime);
}

function toDate(time) {
    return new Date(time.substring(0, 10) + ' ' + time.substring(11));
}

function getTime(line) {
    return line.substring(0, 23);
}

