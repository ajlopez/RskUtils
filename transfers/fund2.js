
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const accounts = require('./accounts.json');
const naccounts = accounts.length;

const amount = parseInt(process.argv[2]);

const client = rskapi.client(config.host);

let gasprice;

async function transfer(sender, account) {
    const balance = parseInt(await client.balance(sender.address));
    
    let ntimes = Math.floor(balance / (amount + gasprice * 21000));
    
    if (ntimes == 0)
        return;
    
    if (ntimes > 5)
        ntimes = 5;

    let nonce = parseInt(await client.nonce(sender.address));
    const nonce0 = parseInt(await client.host().getTransactionCount(sender.address, "latest"));

    if (nonce >= nonce0 + 5)
        return;
    
    ntimes -= nonce - nonce0;
    
    if (ntimes == 0)
        return;
    
    console.log('balance', balance);

    for (let k = 0; k < ntimes; k++) {
        console.log("transfer from", sender.address, "to", account.address);
        await client.transfer(sender, account.address, amount, { nonce: nonce++ });
    }
}

(async function() {    
    gasprice = parseInt(await client.host().getGasPrice());
    
    console.log('gas price', gasprice);
    
    try {
        while (true) {
            const sender = accounts[Math.floor(Math.random() * 60)];
            const account = accounts[Math.floor(Math.random() * naccounts)];
            
            try {
                await transfer(sender, account);
            }
            catch (ex) {
                console.log(ex);
            }
        }
    }
    catch (ex) {
        console.log(ex);
    }
})();

