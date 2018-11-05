
// https://ethereum.stackexchange.com/questions/39384/how-to-generate-private-key-public-key-and-address

var utils = require('ethereumjs-util');

function generateRandomHexaByte() {
    var n = Math.floor(Math.random() * 255).toString(16);
    
    while (n.length < 2)
        n = '0' + n;
    
    return n;
}

function generateRandomPrivateKey() {
    var key = '';
    
    for (var k = 0; k < 32; k++)
        key += generateRandomHexaByte();
    
    return new Buffer(key, 'hex');
}

function generateAddress() {
    var privateKey = generateRandomPrivateKey();
    var publicKey = utils.privateToPublic(privateKey).toString('hex');
    var address = utils.privateToAddress(privateKey).toString('hex');
    
    return {
        privateKey: '0x' + privateKey.toString('hex'),
        publicKey: '0x' + publicKey,
        address: '0x' + address
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

