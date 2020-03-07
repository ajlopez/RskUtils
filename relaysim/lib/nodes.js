
function Node() {
    const self = this;
    const peers = [];
    let messages = [];
    let newmessages = [];
    let hasblock = false;
    
    this.addPeer = function (peer) {
        if (peers.indexOf(peer) < 0)
            peers.push(peer);
    };
    
    this.hasBlock = function () { return hasblock; };
    
    this.postMessage = function (msg) {
        newmessages.push(msg);
    };
    
    this.processMessages = function () {
        for (let n in messages) {
            const message = messages[n];
            processMessage(message);
        }
    }
    
    this.step = function () {
        messages = newmessages;
        newmessages = [];
    }
    
    function processMessage(message) {
        if (message.type === 'block') {
            if (hasblock)
                return;
            
            hasblock = true;
            
            relayBlock(message.from);
        }
        
        if (message.type === 'hash') {
            if (hasblock)
                return;
            
            getBlock(message.from);
        }
        
        if (message.type === 'getblock') {
            sendBlock(message.from);
        }
    }
    
    function relayBlock(sender) {
        const ndirect = Math.max(Math.floor(Math.sqrt(peers.length)), 3);
        
        for (let n in peers) {
            const peer = peers[n];
            
            if (peer === sender)
                continue;
        
            if (n < ndirect)
                sendBlock(peer);
            else
                sendHash(peer);
        }
    }
    
    function getBlock(peer) {
        peer.postMessage({ from: self, type: 'getblock' });
    }
    
    function sendBlock(peer) {
        peer.postMessage({ from: self, type: 'block' });
    }
    
    function sendHash(peer) {
        peer.postMessage({ from: self, type: 'hash' });
    }
}

function createNode() {
    return new Node();
}

module.exports = {
    node: createNode
};

