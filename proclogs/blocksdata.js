
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

let lastline;
let lastlinetime;

const TXS_FIELDS_VALIDATION = 1;
const FORK_DETECTION_RULE = 2;
const TX_DONE = 3;
const SAVE_RECEIPTS = 4;

let timestartverification;
let timestartexecution;
let timeendexecution;
let timestartclose;

const BLOCK_NUMBER = 0;
const NO_TXS = 1;
const NO_UNCLES = 2;
const PROCESSED_TIME = 3;
const VALIDATION_TIME = 4;
const EXECUTION_TIME = 5;
const SAVE_TIME = 6;
const TXS_VALIDATION_TIME = 7;
const FORK_VALIDATION_TIME = 8;
const TRIE_TIME = 9;
const RECEIPTS_TIME = 10;

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    
    if (!isBlockLine(line))
        continue;
    
    if (line.indexOf("Validating header") >= 0)
        data[NO_UNCLES]++;
    
    if (line.indexOf("Validation rule BlockTxsFieldsValidationRule") >= 0) {
        lastline = TXS_FIELDS_VALIDATION;
        lastlinetime = toDate(getTime(line));
    }
    else if (line.indexOf("Validation rule ForkDetectionDataRule") >= 0) {
        lastline = FORK_DETECTION_RULE;
        lastlinetime = toDate(getTime(line));
    }
    else if (line.indexOf("Start saveReceipts") >= 0) {
        lastline = SAVE_RECEIPTS;
        lastlinetime = toDate(getTime(line));
    }
    else if (line.indexOf("tx done") >= 0) {
        lastline = TX_DONE;
        lastlinetime = toDate(getTime(line));
    }
    else if (lastline === TXS_FIELDS_VALIDATION) {
        data[TXS_VALIDATION_TIME] = toDate(getTime(line)) - lastlinetime;
        lastline = 0;
    }
    else if (lastline === FORK_DETECTION_RULE) {
        data[FORK_VALIDATION_TIME] += toDate(getTime(line)) - lastlinetime;
        lastline = 0;
    }
    else if (lastline === TX_DONE && line.indexOf("execute done") >= 0) {
        data[TRIE_TIME] = toDate(getTime(line)) - lastlinetime;
        lastline = 0;
    }
    else if (lastline === TX_DONE)
        lastline = 0;
    else if (lastline === SAVE_RECEIPTS) {
        data[RECEIPTS_TIME] = toDate(getTime(line)) - lastlinetime;
        lastline = 0;
    }
    
    if (line.indexOf("Try connect block hash") >= 0) {
        inblock = true;
        state = START_BLOCK;
        
        const p = line.indexOf("number: ");
        
        const number = parseInt(line.substring(p + "number: ".length));
        
        data = [ number, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        
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
        data[VALIDATION_TIME] = timestartexecution - timestartverification;
        continue;
    }
    
    if (state === EXECUTION && line.indexOf("tx done") >= 0) {
        timeendexecution = toDate(getTime(line));
        
        continue;
    }
    
    if (state === EXECUTION && line.indexOf("execute done") >= 0) {
        state = END_BLOCK;
        timestartclose = timeendexecution;
        data[EXECUTION_TIME] = timeendexecution - timestartexecution;
        
        continue;
    }
    
    if (line.indexOf("processed after:") >= 0) {
        const p = line.indexOf("processed after: [");
        const time = parseInt(line.substring(p + "processed after: [".length));
               
        data[PROCESSED_TIME] = Math.floor((time + 500000) / 1000000);
        data[SAVE_TIME] = toDate(getTime(line)) - timestartclose;
        
        blocks.push(data);
        
        inblock = false;
        
        continue;
    }
    
    if (line.indexOf("tx.list: [") >= 0) {
        const p = line.indexOf("tx.list: [");
        
        const ntxs = parseInt(line.substring(p + "tx.list: [".length));
        
        data[NO_TXS] = ntxs;
        
        continue;
    }
}

for (let k = 0, l = blocks.length; k < l; k++) {
    let result = '';
    const block = blocks[k];
    
    for (let j = 0; j < block.length; j++) {
        if (j)
            result += ',';
        
        result += block[j];
    }
    
    console.log(result);
}

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

