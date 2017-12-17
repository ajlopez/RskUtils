
var fs = require('fs');
var path = require('path');
var execSync = require('child_process').execSync;
var ajgenesis = require('ajgenesis');
var sargs = require('simpleargs');
var config = require('./config.json');

sargs
    .define('m', 'miners', 1, 'Number of miners')
	.define('n', 'notminers', 2, 'Number of not miners');
	
var options = sargs(process.argv.slice(2));

var nnodes = options.miners + options.notminers;
var nodes = [];

ajgenesis.fs.createDirectory('build');

for (var nnode = 0; nnode < nnodes; nnode++)
    nodes.push(generateNode(nnode));

var networkId = 778;

nodes.forEach(function (node) {
    var model = {
        node: node,
        nodes: nodes,
        networkId: networkId
    };
    
    var n = makeNumber(node.number, 2);
    
    ajgenesis.fs.createDirectory('build');
    ajgenesis.fileTransform('node.conf.tpl', path.join('build', 'node' + n + '.conf'), model);
});

var model = {
    nodes: nodes,
    jar: config.jar
};

function generateNode(nnode) {
	var number = makeNumber(nnode + 1, 2);
    var node = { };

    node.miner = nnode < options.miners;
    node.rpc = true;
    node.host = '127.0.0.1';
    node.port = 30503 + nnode;
    node.rpcport = 4444 + nnode;
    node.number = number;
    node.mnumber = 1;
    
    var nodedata = generateNodeData();
    
    node.nodeId = nodedata.nodeId;
    node.privateKey = nodedata.privateKey;
    
    return node;
}

function generateNodeData() {
    var cmd = 'java -cp ' + config.jar + ' co.rsk.GenNodeKeyId';
    var json = execSync(cmd).toString();
    return JSON.parse(json);
}

function makeNumber(n, w) {
    n = n.toString();
    
    while (n.length < w)
        n = "0" + n;
    
    return n;
}

