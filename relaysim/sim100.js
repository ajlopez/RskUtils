
const nodes = require('./lib/nodes');

const NNODES = 1000;
const NPEERS = 10;

const network = [];

for (let k = 0; k < NNODES; k++)
    network.push(nodes.node());

for (let k = 0; k < network.length; k++) {
    for (let j = 0; j < NPEERS; j++) {
        const peer = network[Math.floor(Math.random() * network.length)];
        network[k].addPeer(peer);
        peer.addPeer(network[k]);
    }
}

network[0].postMessage({ type: 'block' });
network[0].step();

let nhasblocks = 0;

while (nhasblocks < network.length) {
    nhasblocks = 0;
    
    for (let k = 0; k < network.length; k++) {
        const node = network[k];
        
        node.processMessages();
        
        if (node.hasBlock())
            nhasblocks++;
    }
    
    for (let k = 0; k < network.length; k++)
        network[k].step();
    
    console.log(nhasblocks);
}

