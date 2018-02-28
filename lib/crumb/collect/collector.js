const fs   = require('fs');
const yaml = require('js-yaml');

class Collector {
    constructor() {
    }

    load(jobs_yml, input_csv) {
        let x = yaml.safeLoad(fs.readFileSync(jobs_yml))
        console.log(x);

        // load input_csv
        // let headers = first row.
        // for row of x => spread

        // load job
        // for step in job
        //    replace item with headers ($col)
        //    exec
        // save...
    }

    spread() {
        // broadcast to all nodes.
    }
  
}

module.exports = Collector;