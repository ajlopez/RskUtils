
var sjr = require('simplejsonrpc');
var sa = require('simpleargs');

var config = require('./config.json');

var peers = {};
var visited = [];
var pending = 0;

function getPeer(data) {
	var peer = {};
	
	var parts = data.split('|');
	
	peer.id = parts[0].trim();
	
	parts = parts[1].trim().split('/');
	
	peer.host = parts[0];
	
	return peer;
}

function dumpPeers() {
	for (var id in peers) {
		var peer = peers[id];
		
		peer.peers.forEach(function (child) {
			if (peers[child] && peers[child].peers.indexOf(id) < 0)
				peers[child].peers.push(id);
		});
	}

	console.dir(peers);
	
	console.log('count', Object.keys(peers).length);
}

function getPeers(host, port, id) {
	if (id)
		if (visited.indexOf(id) < 0)
			visited.push(id);
		else
			return;
			
	pending++;
	console.log('connecting peer', host, port, '...');
	
	var client = sjr.client({
		protocol: 'http',
		host: host,
		port: port
	});
	
	client.call('net_peerList', [], function (err, data) {
			
		pending--;

		var newpeer = {
			host: host,
			peers: []
		}						

		if (err) {
			console.log('error accesing host', host);
			console.log(err);
			newpeer.rpc = false;
		}
		else {
			console.log('host', host);
			
			data.forEach(function (datum) {
				var peer = getPeer(datum);
				
				newpeer.peers.push(peer.id);
				
				if (visited.indexOf(peer.id) < 0)
					getPeers(peer.host, 4444, peer.id);
			});

			newpeer.rpc = true;
		}
		
		if (id)
			peers[id] = newpeer;
		
		if (!pending)
			dumpPeers();
	});
}

config.hosts.forEach(function (host) {
	getPeers(host.host, host.port);
});
