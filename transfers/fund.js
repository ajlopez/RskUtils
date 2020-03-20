
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const accounts = require('./accounts.json');
const naccounts = accounts.length;

const amount = parseInt(process.argv[2]);
let nsender = process.argv[3];

if (nsender)
    nsender = parseInt(nsender);
else
    nsender = 0;

const sender = accounts[nsender];

const client = rskapi.client(config.host);

let nonce;

async function transfer(account) {
    console.log("transfer from", sender.address, "to", account.address);
    
    const txh = await client.transfer(sender, account.address, amount, { nonce: nonce++, gas: 21000 });
    
    if (nonce % 5 == 0) {
        await client.receipt(txh, 0);
        nonce = await client.nonce(sender.address);
    }
}

(async function() {
    try {
        nonce = await client.nonce(sender.address);
        
        for (let k = 0; k < naccounts * 2; k++) {
            const account = accounts[Math.floor(Math.random() * (naccounts - 1)) + 1];
            await transfer(account);
        }
    }
    catch (ex) {
        console.log(ex);
    }
})();

