
var sjr = require('simplejsonrpc');
var sa = require('simpleargs');

var config = require('./config.json');

sa
    .define('h', 'host', config.host, 'Host JSON RPC entry point')

var options = sa(process.argv.slice(2));

console.log(options);

if (options.host)
	config.hosts = options.host.split(',');

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

	console.log(JSON.stringify(peers, null, 4));
	
	console.log('count', Object.keys(peers).length);
}

function getPeers(address, id) {
	if (id)
		if (visited.indexOf(id) < 0)
			visited.push(id);
		else
			return;
			
	pending++;
	
	console.log('connecting peer', address, '...');
	
	var client = sjr.client(address);
	
	client.call('net_peerList', [], function (err, data) {
			
		pending--;

		var newpeer = {
			address: address,
			peers: []
		}						

		if (err) {
			console.log('error accesing host', address);
			console.log(err);
			newpeer.rpc = false;
		}
		else {
			console.log('host', address);
			
			data.forEach(function (datum) {
				var peer = getPeer(datum);
				
				newpeer.peers.push(peer.id);
				
				if (visited.indexOf(peer.id) < 0)
					getPeers('http://' + peer.host + ':4444', peer.id);
			});

			newpeer.rpc = true;
			
			client.call('web3_clientVersion', [], function (err, data) {
				if (data)
					newpeer.version = data;
			});
			
			client.call('eth_syncing', [], function (err, data) {
				if (!err)
					newpeer.syncing = data;
			});
			
			client.call('sco_peerList', [], function (err, data) {
				if (!err)
					newpeer.scoring = data;
			});
		}
		
		if (id)
			peers[id] = newpeer;
		
		if (!pending)
			dumpPeers();
	});
}

var id = 0;

config.hosts.forEach(function (host) {
	getPeers(host, ++id);
});
