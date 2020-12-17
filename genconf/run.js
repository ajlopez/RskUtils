
var config = require('./config.json');
var spawn = require('child_process').spawn;

var nnode = process.argv[2];

var cmd = 'java -cp ' + config.jar + ' -Drsk.conf.file=build/node' + makeNumber(nnode, 2) + '.conf co.rsk.Start --regtest';
spawn(cmd, { stdio: 'inherit', shell: true });

function makeNumber(n, w) {
    n = n.toString();
    
    while (n.length < w)
        n = "0" + n;
    
    return n;
}

