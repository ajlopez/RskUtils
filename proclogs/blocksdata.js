
const fs = require('fs');

const filename = process.argv[2];

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

const blocks = [];
let data = [];
let inblock = false;
let state;

const START_BLOCK = 1;
const VERIFICATION = 2;
const EXECUTION = 3;
const END_BLOCK = 4;

let timestartverification;
let timestartexecution;
let timeendexecution;
let timestartclose;

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    
    if (!isBlockLine(line))
        continue;
    
    if (line.indexOf("Try connect block hash") >= 0) {
        inblock = true;
        state = START_BLOCK;
        
        const p = line.indexOf("number: ");
        
        const number = parseInt(line.substring(p + "number: ".length));
        
        data = [ number, 0, 0 ];
        
        continue;
    }
    
    if (!inblock)
        continue;
    
    if (state === START_BLOCK && line.indexOf("[blockvalidator") >= 0) {
        state = VERIFICATION;
        timestartverification = toDate(getTime(line));
        continue;
    }
    
    if (state === VERIFICATION && line.indexOf("[blockvalidator") < 0) {
        state = EXECUTION;
        timestartexecution = toDate(getTime(line));
        data[3] = timestartexecution - timestartverification;
        continue;
    }
    
    if (state === EXECUTION && line.indexOf("tx done") >= 0) {
        timeendexecution = toDate(getTime(line));
        
        continue;
    }
    
    if (state === EXECUTION && line.indexOf("execute done") >= 0) {
        state = END_BLOCK;
        timestartclose = timeendexecution;
        data[4] = timeendexecution - timestartexecution;
        
        continue;
    }
    
    if (line.indexOf("processed after:") >= 0) {
        const p = line.indexOf("processed after: [");
        const time = parseInt(line.substring(p + "processed after: [".length));
               
        data[2] = time;
        data[5] = toDate(getTime(line)) - timestartclose;
        
        blocks.push(data);
        
        inblock = false;
        
        continue;
    }
    
    if (line.indexOf("tx.list: [") >= 0) {
        const p = line.indexOf("tx.list: [");
        
        const ntxs = parseInt(line.substring(p + "tx.list: [".length));
        
        data[1] = ntxs;
        
        continue;
    }
}

console.log(JSON.stringify(blocks, null, 4));

function isBlockLine(line) {
    return line.indexOf('[blockchain') >= 0 ||
           line.indexOf('[blockvalidator') >= 0 ||
           line.indexOf('[blockexecutor') >= 0 ||
           line.indexOf('[execute') >= 0;
}

function toDate(time) {
    return new Date(time.substring(0, 10) + ' ' + time.substring(11));
}

function getTime(line) {
    return line.substring(0, 23);
}

