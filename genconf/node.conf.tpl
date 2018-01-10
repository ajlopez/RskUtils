
# Private network
blockchain.config.name = "regtest"

# not used in private network
peer.discovery = {

    # if peer discovery is off
    # the peer window will show
    # only what retrieved by active
    # peer [true/false]
    enabled = false

	# List of the peers to start
	# the search of the online peers
	# values: [ip:port]
	ip.list = [
	]

	# Interface to bind UDP
	# Make sure you are using the correct bind ip. Wildcard value: 0.0.0.0
	bind.ip = 0.0.0.0
}

peer {

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

    # currently only protocol supported is RSK
    capabilities = [rsk]

    # Local network adapter IP to which
    # the discovery UDP socket is bound
    # e.g: 192.168.1.104
    #
    # if the value is empty will be retrived
    # by punching to some know address e.g: www.google.com
    bind.ip = ""

    # Peer for server to listen for incoming
    # connections
    listen.port = ${node.port}

    # connection timeout for trying to connect to a peer [seconds]
    connection.timeout = 2

    # the parameter specifies how much time we will wait for a message to come before closing the channel
    channel.read.timeout = 30

    # Private key of the peer
    # derived nodeId = ${node.nodeId}
    privateKey = ${node.privateKey}

    # Network id
    networkId = ${networkId}

    p2p {
        # the default version outbound connections are made with
        # inbound connections are made with the version declared by the remote peer (if supported)
        # version = 4

        # max frame size in bytes when framing is enabled
        framing.maxSize = 32768

        # forces peer to send Handshake message in format defined by EIP-8,
        # see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-8.md
        eip8 = true
    }

    # max number of active peers our node will maintain
    # extra peers trying to connect us will be dropeed with TOO_MANY_PEERS message
    # the incoming connection from the peer matching 'peer.trusted' entry is always accepted
    maxActivePeers = 30

    # list of trusted peers the incoming connections is always accepted from
    trusted = [
        # Sample entries:
        # {nodeId = "e437a4836b77ad9d9ffe73ee782ef2614e6d8370fcf62191a6e488276e23717147073a7ce0b444d485fff5a0c34c4577251a7a990cf80d8542e21b95aa8c5e6c"},
        # {ip = "11.22.33.44"},
        # {ip = "11.22.33.*"},
        # {
        #   nodeId = "e437a4836b77ad9d9ffe73ee782ef2614e6d8370fcf62191a6e488276e23717147073a7ce0b444d485fff5a0c34c4577251a7a990cf80d8542e21b95aa8c5e6c"
        #   ip = "11.22.33.44"
        # }
    ]
}

# the folder resources/genesis
# contains several versions of
# genesis configuration according
# to the network the peer will run on
genesis = rsk-dev.json
# genesis = devnet-genesis.json

# the time we wait to the network
# to approve the transaction, the
# transaction got approved when
# include into a transactions msg
# retrieved from the peer [seconds]
transaction.approve.timeout = 15

# the number of blocks should pass
# before pending transaction is removed
transaction.outdated.threshold = 10

# the number of seconds should pass
# before pending transaction is removed
# (suggested value: 10 blocks * 10 seconds by block = 100 seconds)
transaction.outdated.timeout = 100

# default directory where we keep
# basic Serpent samples relative
# to home.dir
samples.dir = samples

database {
    # place to save physical storage files
    dir = private-node${node.number}

    # every time the application starts
    # the existing database will be
    # destroyed and all the data will be
    # downloaded from peers again [true/false]
    reset = false
}

dump {
    # for testing purposes
    # all the state will be dumped
    # in JSON form to [dump.dir]
    # if [dump.full] = true
    # possible values [true/false]
    full = false
    dir = dmp

    # This defines the vmtrace dump
    # to the console and the style
    # -1 for no block trace
    # styles: [pretty/standard+] (default: standard+)
    block = -1
    style = pretty

    # clean the dump dir each start
    clean.on.restart = true
}

# structured trace
# is the trace being
# collected in the
# form of objects and
# exposed to the user
# in json or any other
# convenient form.
vm.structured {
    trace = true
    dir = vmtrace
    compressed = false
    initStorageLimit = 10000

    # enables storage disctionary db recording
    # see the org.ehereum.db.StorageDisctionary class for details
    storage.dictionary.enabled = false
}

# make changes to tracing options
# starting from certain block
# -1 don't make any tracing changes
trace.startblock = -1

# invoke vm program on
# message received,
# if the vm is not invoked
# the balance transfer
# occurs anyway  [true/false]
play.vm = true

# hello phrase will be included in
# the hello message of the peer
hello.phrase = Private${node.number}

# this property used
# mostly for a debug purpose
# so if you don't know exactly how
# to apply it leave to be [-1]
#
# ADVANCED: if we want to load a root hash
# for db not from the saved block chain (last block)
# but any manual hash this property will help.
# values [-1] - load from db
#        [hex hash 32 bytes] root hash
root.hash.start = null

# Key value data source values: [leveldb/redis/mapdb/hashdb]
keyvalue.datasource = leveldb

# Redis cloud enabled flag.
# Allows using RedisConnection for creating cloud based data structures.
redis.enabled=false

record.blocks=false
blockchain.only=false

# Load the blocks
# from a rlp lines
# file and not for
# the net
blocks.loader=""


# the parameter speciphy when exactly
# to switch managing storage of the
# account on autonomous db
details.inmemory.storage.limit=1

# cache for blockchain run
# the flush hapens depending
# on memory usage or blocks
# treshhold if both specipied
# memory will take precedence
cache {
    flush {
        # [0.7 = 70% memory to flush]
        memory = 0

        # [10000 flush each 10000 blocks]
        blocks = 1
    }
}

# eth sync process
sync {

    # block chain synchronization
    # can be: [true/false]
    enabled = true

    # maximum blocks hashes to ask.
    # sending GET_BLOCK_HASHES msg
    # we specify number of block we want
    # to get, recomendec value [1..1000]
    # Default: unlimited
    max.hashes.ask = 10000

    # maximum blocks to ask,
    # when downloading the chain
    # sequenteally sending GET_BLOCKS msg
    # we specify number of blocks we want
    # to get, recomendec value [1..120]
    max.blocks.ask = 100

    # minimal peers count
    # used in sync process
    # sync may use more peers
    # than this value
    # but always trying to get
    # at least this number from discovery
    peer.count = 10

    # whether to wait for blockchain sync to start mining and pegging.
    waitForSync = false

    # whether to do a System.exit() if something happens outside the "success flow"
    exitOnBlockConflict = true
}

# miner options
miner {
    server.enabled = ${node.miner}
    client.enabled = ${node.miner}
    minGasPrice = 0

    # these are values used by MinerServer to set the notify flag on/off
    gasUnitInDollars = 0.001
    minFeesNotifyInDollars = 30

	# this string is computed
	# to be eventually the address
	# that get the miner reward
	coinbase.secret = monkey${node.number}
}

simulateTxs {
    enabled = false
}

federator {
    enabled = false
}

rpc {
    enabled = ${node.rpc}
    port = ${node.rpcport}
}

wallet {
	enabled = true
    accounts = [
    ]
}

blocks {
    enabled: false
    recorder: "blocksminer1.txt"
}

wire {
    protocol: "rsk"
}

blockchain {
    flush: true
}

#Solc samplepath, for windows in this case
#solc.path= /solc/solc.exe
#solc.path= /usr/bin/solc
#solc.path= /Software/solidity-windows/solc.exe

#################################
#  TO Enable a multi user node  #
#################################
#multipleUser {
#    enable: true
#    file.path: /home/mario/RSK/accounts/ips.json
#}

rpc = {
	cors = "*"
    modules = [
        {
            name: "eth",
            version: "1.0",
            enabled: "true",
        },
        {
            name: "personal",
            version: "1.0",
            enabled: "true",
        },
        {
            name: "net",
            version: "1.0",
            enabled: "true",
        },
        {
            name: "rpc",
            version: "1.0",
            enabled: "true",
        },
        {
            name: "web3",
            version: "1.0",
            enabled: "true",
        },
        {
            name: "evm",
            version: "1.1",
            enabled: "true"
        }
    ]
}

blockchain.newrepository = true

messages = {
	recorder = {
		enabled: true
		commands: [ "RSK_MESSAGE:STATUS_MESSAGE"]
	}
}

blockchain.flush = true
blockchain.flushNumberOfBlocks = 100

# target block gas limit (genesis also has 10M)
targetgaslimit = 10000000
