
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const accounts = require('./accounts.json');
const naccounts = accounts.length;

const token = utils.getAddress(config, process.argv[2]);
const amount = parseInt(process.argv[3]);

const client = rskapi.client(config.host);

let gasprice;

async function allocate(sender) {
    const balance = parseInt(await client.balance(sender.address));
    
    let ntimes = Math.floor(balance / (gasprice * 60000));
    
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
        const account = accounts[Math.floor(Math.random() * naccounts)];
        console.log("allocate from", sender.address, "to", account.address);
        await client.invoke(sender, token, "allocateTo(address,uint256)", [ account.address, amount ], { nonce: nonce++, gas: 60000 });
    }
}

(async function() {    
    gasprice = parseInt(await client.host().getGasPrice());
    
    console.log('gas price', gasprice);
    
    try {
        while (true) {
            const sender = accounts[Math.floor(Math.random() * 200)];
            
            try {
                await allocate(sender);
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

