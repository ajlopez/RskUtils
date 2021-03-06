
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const accounts = require('./accounts.json');
const naccounts = accounts.length;

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

const token = utils.getAddress(config, process.argv[2]);
const amount = parseInt(process.argv[3]);
const ntxs = process.argv.length > 4 ? parseInt(process.argv[4]) : 0;

const client = rskapi.client(config.host);
const provider = client.host().provider();

let gasprice;

async function allocate(sender) {
    const balance = parseInt(await client.balance(sender.address));
    
    console.log('balance', balance);

    let ntimes = Math.floor(balance / (gasprice * 60000));

    console.log('ntimes', ntimes);
    
    if (ntimes == 0)
        return;
    
    if (ntimes > 5)
        ntimes = 5;

    let nonce = parseInt(await client.nonce(sender.address));
    const nonce0 = parseInt(await client.host().getTransactionCount(sender.address, "latest"));

    console.log('ntimes 2', nonce - nonce0);
    
    if (nonce >= nonce0 + 5)
        return;
    
    ntimes -= nonce - nonce0;
    
    if (ntimes == 0)
        return;

    for (let k = 0; k < ntimes; k++) {
        const account = accounts[Math.floor(Math.random() * naccounts)];
        console.log("allocate from", sender.address, "to", account.address);
        await client.invoke(sender, token, "increment(uint256)", [ account.address, amount ], { nonce: nonce++, gas: 60000 });
    }
}

(async function() {    
    gasprice = parseInt(await client.host().getGasPrice());
    
    console.log('gas price', gasprice);
    
    try {
        while (true) {
            const data = await promisify(cb => provider.call('txpool_status', [], cb));
            
            console.log('transaction pool size', data.pending);
            
            if (ntxs && data.pending > ntxs) {
                await promisify(cb => setTimeout(function () { cb(null, null) }, 1000));
                continue;
            }

            const sender = accounts[Math.floor(Math.random() * 600)];
            
            try {
                console.log('sender', sender.address);
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

