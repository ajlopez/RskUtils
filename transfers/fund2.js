
const rskapi = require('rskapi');
const Tx = require('ethereumjs-tx');

const gasprice = 60000000;
const gascost = 21000;

const accounts = require('./accounts.json');
const naccounts = accounts.length;

const hosturl = process.argv[2];
const amount = parseInt(process.argv[3]);

const host = rskapi.host(hosturl);

async function transfer(sender, account) {
    console.log('trying', sender.address);
    
    if (sender.balance === undefined)
        sender.balance = await host.getBalance(sender.address);
    
    if (sender.balance <= 5 * (amount + gasprice * gascost))
        return;
    
    console.log("transfer from", sender.address, "to", account.address);

    const privateKey = new Buffer(sender.privateKey.substring(2), 'hex');
    let nonce = await host.getTransactionCount(sender.address, "pending");
    
    for (let k = 0; k < 5; k++) {
        const tx = {
            nonce: nonce,
            to: account.address,
            value: amount,
            gasPrice: gasprice,
            gas: gascost
        };
        
        const signedtx = new Tx(tx);
        signedtx.sign(privateKey);
        
        const serializedTx = '0x' + signedtx.serialize().toString('hex');
        
        const txhash = await host.sendRawTransaction(serializedTx);
        console.log('transaction hash', txhash);
        
        nonce++;
        sender.balance -= amount + gasprice * gascost;
    }
}

(async function() {    
    try {
        while (true) {
            const sender = accounts[Math.floor(Math.random() * 60)];
            const account = accounts[Math.floor(Math.random() * naccounts)];
            await transfer(sender, account);
        }
    }
    catch (ex) {
        console.log(ex);
    }
})();

