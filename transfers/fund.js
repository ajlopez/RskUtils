
const rskapi = require('rskapi');
const Tx = require('ethereumjs-tx');

const accounts = require('./accounts.json');
const sender = accounts[0];
const privateKey = new Buffer(sender.privateKey.substring(2), 'hex');
const naccounts = accounts.length;

const hosturl = process.argv[2];
const amount = parseInt(process.argv[3]);

const host = rskapi.host(hosturl);

async function transfer(account) {
    console.log("transfer to", account.address);
    
    const nonce = await host.getTransactionCount(sender.address, "pending");
    
    const tx = {
        nonce: nonce,
        to: account.address,
        value: amount,
        gasPrice: 60000000,
        gas: 21000
    };
    
    const signedtx = new Tx(tx);
    signedtx.sign(privateKey);
    
    const serializedTx = '0x' + signedtx.serialize().toString('hex');
    
    const txhash = await host.sendRawTransaction(serializedTx);
    console.log('transaction hash', txhash);
    
    while (true) {
        const txr = await host.getTransactionReceiptByHash(txhash);
        
        if (txr)
            return;
    }
}

(async function() {
    try {
        for (let k = 0; k < naccounts * 2; k++) {
            const account = accounts[Math.floor(Math.random() * (naccounts - 1)) + 1];
            await transfer(account);
        }
    }
    catch (ex) {
        console.log(ex);
    }
})();

