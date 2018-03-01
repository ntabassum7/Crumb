const yaml = require('js-yaml');
const fs = require('fs');

const DiskSaver = require('./save/disk');
const Collector = require('./collect/collector');

class Crumb {

    constructor(jobs_yml) {
        this.jobs = yaml.safeLoad(fs.readFileSync(jobs_yml))

        this.saver = null;
        if( this.jobs.disk )
        {
            this.saver = new DiskSaver(this.jobs.disk.path || 'crumb_output');
        }
        if( this.saver == null )
            throw new Error("Must specify a persistance option (e.g. disk, or spaces bucket)");

        this.collector = new Collector(this.saver);
    }

}

module.exports = Crumb;