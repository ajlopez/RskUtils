
const fs = require('fs');

const filename = process.argv[2];

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

console.log('lines:', lines.length);

const requests = [];
let fromtime = null;
let totime = null;

for (let k = 0, l = lines.length; k < l; k++) {
   const line = lines[k].trim();
   
   if (line.indexOf('Request') >= 0 && line.indexOf('eth_call') >= 0)
       addRequest(line);
   else if (line.indexOf('Response') >= 0 && line.indexOf('"result":"0x') >= 0)
       addResponse(line); 
}

let processtime = 0;

for (let n in requests)
    processRequest(n, requests[n][0], requests[n][1]);

const ncalls = Object.keys(requests).length;

console.log('calls', ncalls);
console.log('from', fromtime);
console.log('to', totime);

const from = toDate(fromtime);
const to = toDate(totime);

console.log('process time', processtime);
console.log('average process call time', processtime / ncalls);
console.log('total time', to - from);
console.log('average call time', (to - from) / ncalls);

function toDate(time) {
    return new Date(time.substring(0, 10) + ' ' + time.substring(11));
}

function getTime(line) {
    return line.substring(0, 24);
}

function getId(line) {
    const pid = line.indexOf('"id":');
    
    return parseInt(line.substring(pid + 5));
}

function addRequest(line) {
    const id = getId(line);
    
    requests[id] = [ line ];
}

function addResponse(line) {
    const id = getId(line);
    
    if (requests[id])
        requests[id].push(line);
}

function processRequest(id, request, response) {
    if (!response)
        return;
    
    const reqtime = getTime(request);
    const restime = getTime(response);
    
    if (!fromtime || reqtime < fromtime)
        fromtime = reqtime;
    
    if (!totime || restime > totime)
        totime = restime;
    
    processtime += toDate(totime) - toDate(fromtime);
    
//    console.log(id, getTime(request), getTime(response));    
}

