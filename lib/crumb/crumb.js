const yaml = require('js-yaml');
const fs = require('fs');

const DiskSaver = require('./save/disk');
const Collector = require('./collect/collector');
const Baker     = require('../baker/interface');

const Local = require('./collect/local');
const Remote = require('./collect/remote');

class Crumb {

    constructor(jobs_yml) {
        this.jobs = yaml.safeLoad(fs.readFileSync(jobs_yml))

        this.baker = new Baker();
    }

    async initCollector()
    {
        this.saver = null;
        if( this.jobs.disk )
        {
            this.saver = new DiskSaver(this.jobs.disk.path || 'crumb_output');
        }
        if( this.saver == null )
            throw new Error("Must specify a persistance option (e.g. disk, or spaces bucket)");


        this.nodes = [];
        if( this.jobs.remote )
        {
            let name = this.jobs.remote.name;
            let cwd = this.jobs.remote.cwd;
            let sshConfig = await Baker.retrieveSSHConfigByName(name);
            
            let remote = new Remote(sshConfig,cwd);
            this.nodes.push(remote);
        }
        else
        {
            let localNode = new Local(this.saver);
            this.nodes.push(localNode);
        }

        this.collector = new Collector(this.saver, this.nodes );    
        return this.collector;    
    }

}

module.exports = Crumb;