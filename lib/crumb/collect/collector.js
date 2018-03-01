const fs   = require('fs');
const yaml = require('js-yaml');
const csv  = require('fast-csv');
const firstline = require('firstline')
const child_process = require('child_process');

class Collector {
    constructor() {
        this.nodes = ["a","b","c"];
    }

    async load(jobs_yml, input_csv) {
        let jobs = yaml.safeLoad(fs.readFileSync(jobs_yml))
        console.log(jobs);

        this.spreadFromFile( jobs, input_csv);
        // save...
    }

    fillTemplate(jobs, headers, row)
    {
        let steps = [];
        // Replace $id, etc. in job
        for( var step of jobs.job )
        {
            for( var header of headers )
            {
                let regex = new RegExp(`[$]${header}`, 'g');
                step = step.replace(regex, row[header] )
            }
            console.log( step );
            steps.push( step );
        }
        return steps;
    }

    runJob(node, steps)
    {
        for( let step of steps )
        {
            child_process.execSync(step, {stdio:[0,1,2]});
        }
    }

    spread(data, rowNumber, headers, jobs) {
        // broadcast to all nodes.
        let lucky = rowNumber % this.nodes.length;
        console.log(`Sending ${JSON.stringify(data)} to ${lucky}`);

        let steps = this.fillTemplate(jobs, headers, data);
        this.runJob(lucky, steps)
    }

    async spreadFromFile(jobs, input_csv)
    {
        let self = this;
        let headers = await firstline(input_csv)
        headers = headers.split(',');
        console.log( headers );

        let stream = fs.createReadStream(input_csv);
        let rowNumber = 0;
        csv
         .fromStream(stream)
         .on("data", function(data){
             //console.log(data);
             // spread is just row number % i
             if( rowNumber > 0 )
             {
                self.spread(self.objectFromArray(headers,data), rowNumber, headers, jobs);
             }
             rowNumber++;
         })
         .on("end", function(){
             console.log("done");
         });        
    }

    objectFromArray(headers, item)
    {
        let obj = {};
        let column = 0;
        for( let header of headers )
        {
            obj[header] = item[column++]
        }
        return obj;
    }
  


}

module.exports = Collector;