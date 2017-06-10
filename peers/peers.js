
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
	console.dir(peers);
	
	console.dir('count', Object.keys(peers).length);
}

function getPeers(host, port, id) {
	pending++;
	console.log('connecting peer', host, port, '...');
	
	var client = sjr.client({
		protocol: 'http',
		host: host,
		port: port
	});
	
	client.call('net_peerList', [], function (err, data) {
		if (id && visited.indexOf(id) < 0)
			visited.push(id);
			
		pending--;

		if (err) {
			console.log('error accesing host', host);
			console.log(err);
			
			if (!pending)
				dumpPeers();
				
			return;
		}
		
		console.log('host', host);
		
		var newpeer = {
			host: host,
			peers: []
		}
						
		data.forEach(function (datum) {
			var peer = getPeer(datum);
			
			newpeer.peers.push(peer.id);
			
			if (visited.indexOf(peer.id) < 0)
				getPeers(peer.host, 4444, peer.id);
		});
		
		if (id)
			peers[id] = newpeer;
		
		if (!pending)
			dumpPeers();
	});
}

config.hosts.forEach(function (host) {
	getPeers(host.host, host.port);
});
