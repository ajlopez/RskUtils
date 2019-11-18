
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
   
   if (line.indexOf('Request') >= 0 && line.indexOf('trace_block') >= 0)
       addRequest(line);
   else if (line.indexOf('Response') >= 0 && line.indexOf('action') >= 0)
       addResponse(line);
 
}

let processtime = 0;
let lastfrom = null;
let lastto = null;

for (let n in requests)
    processRequest(n, requests[n][0], requests[n][1]);

const nblocks = Object.keys(requests).length;

console.log('blocks', nblocks);
console.log('from', fromtime);
console.log('to', totime);

const from = toDate(fromtime);
const to = toDate(totime);

console.log('process time', processtime);
console.log('average process block time', processtime / nblocks);
console.log('total time', to - from);
console.log('average block time', (to - from) / nblocks);

function toDate(time) {
    return new Date(time.substring(0, 10) + ' ' + time.substring(11));
}

function getTime(line) {
    return line.substring(0, 23);
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
    const hash = getBlockHash(request);
    
    if (!fromtime || reqtime < fromtime)
        fromtime = reqtime;
    
    if (!totime || restime > totime)
        totime = restime;

    let restimems = toDate(restime);
    let reqtimems = toDate(reqtime);
    
    const dtime = restimems - reqtimems;
    
    let dtime2 = 0;
    
    if (areOverlapped(lastfrom, lastto, reqtimems, restimems)) {
        if (reqtimems < lastfrom) {
            dtime2 += lastfrom - reqtimems;
            lastfrom = reqtimems;
        }
        if (restimems > lastto) {
            dtime2 = restimems - lastto;
            lastto = restimems;
        }
    }
    else {
        dtime2 = dtime;
        lastfrom = reqtimems;
        lastto = restimems;
    }
    
    processtime += dtime2;
        
    console.log(id, getTime(request), getTime(response), dtime, dtime2, hash);
}

function getBlockHash(request) {
    const p = request.indexOf('"params":["');
    const p2 = request.indexOf('"', p + '"params":["'.length);
    
    return request.substring(p + '"params":["'.length, p2);
}

function areOverlapped(from1, to1, from2, to2) {
    if (!from1 || !to1)
        return false;
    
    if (from2 <= from1 && to2 >= to1)
        return true;
    
    if (from2 >= from1 && from2 <= to1)
        return true;
    
    if (to2 >= from1 && to2 <= to1)
        return true;
    
    return false;
}

