// Temporary? interface with baker...

const Promise       = require('bluebird');
const vagrant = Promise.promisifyAll(require('node-vagrant'));
const path    = require('path');

class Baker {
    constructor() {
    }

    static async retrieveSSHConfigByName (name, clusterNodeName) {
        const boxes = path.join(require('os').homedir(), '.baker');
        let dir = path.join(boxes, name);
        let vm = vagrant.create({ cwd: dir });
        let vmSSHConfigUser = await Baker.getSSHConfig(vm, clusterNodeName);

        return vmSSHConfigUser;
    }

    /**
     * Get ssh configurations
     * @param {Obj} machine
     * @param {Obj} nodeName Optionally give name of machine when multiple machines declared in single Vagrantfile.
     */
    static async getSSHConfig (machine, nodeName) {
        try {
            let sshConfig = await machine.sshConfigAsync();
            if(sshConfig && sshConfig.length > 0){

                if( nodeName )
                {
                    for( var i = 0; i < sshConfig.length; i++ )
                    {
                        if( sshConfig[i].host === nodeName )
                           return sshConfig[i];
                    }
                }
                return sshConfig[0];
            } else{
                throw '';
            }
        } catch (err) {
            throw `Couldn't get private ssh key of machine ${err}`;
        }
    }


}

module.exports = Baker;