
const utils = require('./lib/utils');
const rskapi = utils.rskapi;

// from https://ethereum.stackexchange.com/questions/11444/web3-js-with-promisified-api

const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) { reject(err) }

      resolve(res);
    })
);

const config = utils.loadConfiguration('./config.json');

const client = rskapi.client(config.host);
const provider = client.host().provider();

(async function() {
    try {
        const data = await promisify(cb => provider.call('txpool_status', [], cb));
        
        console.log(data);
    }
    catch (ex) {
        console.log(ex);
    }
})();

