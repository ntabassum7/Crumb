const fs   = require('fs');
const csv  = require('fast-csv');
const firstline = require('firstline')
const child_process = require('child_process');
const chalk = require('chalk');

class Collector {
    constructor(saver) {
        this.nodes = ["a","b","c"];
        this.saver = saver;
    }

    async load(jobs, input_csv) {
        this.spreadFromFile( jobs, input_csv);
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

    runJob(node, steps, id)
    {
        for( let step of steps )
        {
            let result = child_process.execSync(step);
            this.saver.save(result, id);
        }
    }

    spread(data, rowNumber, headers, jobs) {
        // broadcast to all nodes.
        let lucky = rowNumber % this.nodes.length;
        console.log(`Sending ${JSON.stringify(data)} to ${lucky}`);

        let steps = this.fillTemplate(jobs, headers, data);
        this.runJob(lucky, steps, rowNumber)
    }

    async spreadFromFile(jobs, input_csv)
    {
        let self = this;
        let headers = (await firstline(input_csv)).trim();
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