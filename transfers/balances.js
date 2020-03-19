
const rskapi = require('rskapi');

const accounts = require('./accounts.json');
const naccounts = accounts.length;

const hosturl = process.argv[2];

const client = rskapi.client(hosturl);

(async function() {    
    try {
        for (let k = 0; k < naccounts; k++) {
            const account = accounts[k].address;
            const balance = await client.balance(account);
            console.log(account, parseInt(balance));
        }
    }
    catch (ex) {
        console.log(ex);
    }
})();

