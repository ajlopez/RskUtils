
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
    let ntimes = 5;

    let nonce = parseInt(await client.nonce(sender));
    const nonce0 = parseInt(await client.host().getTransactionCount(sender, "latest"));

    if (nonce >= nonce0 + 5)
        return;
    
    ntimes -= nonce - nonce0;
    
    if (ntimes == 0)
        return;

    for (let k = 0; k < ntimes; k++) {
        const account = accounts[Math.floor(Math.random() * naccounts)];
        console.log("allocate from", sender, "to", account.address);
        await client.invoke(sender, token, "allocateTo(address,uint256)", [ account.address, amount ], { nonce: nonce++, gas: 60000 });
    }
}

(async function() {    
    gasprice = parseInt(await client.host().getGasPrice());
    
    console.log('gas price', gasprice);
    
    const senders = await client.accounts();
    
    console.dir(senders);
    
    try {
        while (true) {
            const sender = senders[Math.floor(Math.random() * senders.length)];
            
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

