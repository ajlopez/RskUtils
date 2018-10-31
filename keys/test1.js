
// https://ethereum.stackexchange.com/questions/39384/how-to-generate-private-key-public-key-and-address

var utils = require('ethereumjs-util');
var privateKey = new Buffer("256286e1ea084c691001b2da9ea873b45e5b533bcf669dda9276d3976b6ca288", "hex");
var publicKey = utils.privateToPublic(privateKey).toString('hex');
var address = utils.privateToAddress(privateKey).toString('hex');

console.log('private key', privateKey.toString('hex'));
console.log('public key', publicKey);
console.log('address', address);
