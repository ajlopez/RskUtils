
// https://ethereum.stackexchange.com/questions/39384/how-to-generate-private-key-public-key-and-address

var utils = require('ethereumjs-util');

function generateRandomHexaByte() {
    var n = Math.floor(Math.random() * 255).toString(16);
    
    while (n.length < 2)
        n = '0' + n;
    
    return n;
}

function generateRandomPrivateKey() {
    do {
        var keytxt = '';
        
        for (var k = 0; k < 32; k++)
            keytxt += generateRandomHexaByte();
        
        var key = new Buffer(keytxt, 'hex');
    }
    while (!utils.isValidPrivate(key));
    
    return key;
}

function generateAddress() {
    var privateKey = generateRandomPrivateKey();
    var publicKey = '0x' + utils.privateToPublic(privateKey).toString('hex');
    var address = '0x' + utils.privateToAddress(privateKey).toString('hex');
    
    if (!utils.isValidAddress(address))
        throw new Error('invalid address: ' + address);
    
    return {
        privateKey: '0x' + privateKey.toString('hex'),
        publicKey: publicKey,
        address: address
    }
}

var ntimes = parseInt(process.argv[2]);

console.log('[');

for (var n = 0; n < ntimes; n++) {
    if (n > 0)
        console.log(',');
    
    console.log(JSON.stringify(generateAddress(), null, 4));
}

console.log(']');

