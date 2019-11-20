
const rskapi = require('rskapi');
const Tx = require('ethereumjs-tx');

const accounts = require('./accounts.json');
const naccounts = accounts.length;

const hosturl = process.argv[2];

const host = rskapi.host(hosturl);

(async function() {    
    try {
        for (let k = 0; k < naccounts; k++) {
            const account = accounts[k].address;
            const balance = await host.getBalance(account);
            console.log(account, balance);
        }
    }
    catch (ex) {
        console.log(ex);
    }
})();

