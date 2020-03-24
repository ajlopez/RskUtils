
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const accounts = require('./accounts.json');
const naccounts = accounts.length;

const client = rskapi.client(config.host);

let gasprice;

async function factorial(sender) {
    const balance = parseInt(await client.balance(sender.address));
    
    let ntimes = Math.floor(balance / (gasprice * 600000));
    
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
        console.log("calling from", sender.address);
        await client.invoke(sender, config.instances.factorial1.address, "calculate(uint256)", [ 100 ], { nonce: nonce++, gas: 600000 });
    }
}

(async function() {    
    gasprice = parseInt(await client.host().getGasPrice());
    
    console.log('gas price', gasprice);
    
    try {
        while (true) {
            const sender = accounts[Math.floor(Math.random() * 100)];
            
            try {
                await factorial(sender);
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

