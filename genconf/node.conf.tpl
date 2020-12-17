
peer {
    nodeId = ${node.nodeId}
    privateKey = ${node.privateKey}
    
    port = ${node.port}
    
    # Boot node list
    active = [
<# nodes.forEach(function (n) {
    if (n.number == node.number)
        return;
#>
        {
            ip = ${n.host}
            port = ${n.port}
            nodeId = ${n.nodeId}
        },
<#
});
#>
    ]
}

database {
    # place to save physical storage files
    dir = private-node${node.number}
}

# hello phrase will be included in
# the hello message of the peer
hello.phrase = Private${node.number}


# miner options
miner {
    server.enabled = ${node.miner}
    client.enabled = ${node.miner}

	# this string is computed
	# to be eventually the address
	# that get the miner reward
	coinbase.secret = Private${node.number}
}

rpc {
    providers {
        web {
            cors = "*"
            http {
                enabled = true
                bind_address = localhost
                hosts = []
                port = ${node.rpcport}
                # A value greater than zero sets the socket value in milliseconds. Node attempts to gently close all
                # TCP/IP connections with proper half close semantics, so a linger timeout should not be required and
                # thus the default is -1.
                linger_time = -1
            }
            ws {
                enabled = false
            }
        }
    }
}

