
const fs = require('fs');

const filename = process.argv[2];

const text = fs.readFileSync(filename).toString();
const lines = text.split('\n');

let lastQueueSize = null;

for (let k = 0, l = lines.length; k < l; k++) {
    const line = lines[k].trim();
    
    if (isMessageLineStart(line)) {
        console.log(line);
        lastQueueSize = null;
        
        continue;
    }
    
    if (isMessageLineEnd(line)) {
        if (lastQueueSize)
            console.log(lastQueueSize);
        
        console.log(line);
        lastQueueSize = null;
        
        continue;
    }
    
    if (line.indexOf('queue size') >= 0) {
        lastQueueSize = line;
        continue;
    }
}

function isMessageLineStart(line) {
    return line.indexOf('Get task') >= 0 ||
           line.indexOf('Start task') >= 0;
}

function isMessageLineEnd(line) {
    return line.indexOf('End task') >= 0 ||
           line.indexOf('Process message') >= 0 ||
           line.indexOf('processed after') >= 0;
}

