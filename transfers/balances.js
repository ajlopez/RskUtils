
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

const config = utils.loadConfiguration('./config.json');

const accounts = require('./accounts.json');
const naccounts = accounts.length;

const client = rskapi.client(config.host);

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

