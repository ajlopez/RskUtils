
const rskapi = require('rskapi');

const accounts = require('./accounts.json');
const naccounts = accounts.length;

const hosturl = process.argv[2];
const amount = parseInt(process.argv[3]);
let nsender = process.argv[4];

if (nsender)
    nsender = parseInt(nsender);
else
    nsender = 0;

const sender = accounts[nsender];

const client = rskapi.client(hosturl);

let nonce;

async function transfer(account) {
    console.log("transfer from", sender.address, "to", account.address);
    
    const txh = await client.transfer(sender, account.address, amount, { nonce: nonce++ });
    
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

