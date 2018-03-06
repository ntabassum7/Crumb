// Temporary? interface with baker...

const Promise       = require('bluebird');
const vagrant = Promise.promisifyAll(require('node-vagrant'));
const path    = require('path');
const child_process = require('child_process');

class Baker {
    constructor() {
    }

    static info(name, provider)
    {
        let providerOption = provider ? `--provider ${provider}` : '';
        let output = child_process.execSync(`baker info ${name} ${providerOption}`).toString();
        try 
        {
            let obj = JSON.parse(output);
            return obj;
        }
        catch(err)
        {
            throw new Error(`Could not read ${output}: ${err}`);
        }
    }

}

module.exports = Baker;