const fs   = require('fs');
const csv  = require('fast-csv');
const firstline = require('firstline')
const child_process = require('child_process');
const chalk = require('chalk');

class Collector {
    constructor(saver, nodes) {
        this.nodes = nodes;
        this.saver = saver;
    }

    async load(jobs, input_csv, verbose) {
        this.spreadFromFile( jobs, input_csv, verbose);
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

    async spread(data, rowNumber, headers, jobs, verbose) {
        // broadcast to all nodes.
        let luckyNumber = rowNumber % this.nodes.length;
        let node = this.nodes[luckyNumber];
        console.log(`Sending ${JSON.stringify(data)} to ${node.name()}`);

        let steps = this.fillTemplate(jobs, headers, data);
        node.run(steps, rowNumber, verbose);
    }

    async spreadFromFile(jobs, input_csv, verbose)
    {
        let self = this;
        let headers = (await firstline(input_csv)).trim();
        headers = headers.split(',');
        headers = headers.map( h => h.trim() );
        console.log( headers );

        let stream = fs.createReadStream(input_csv);
        let rowNumber = 0;
        csv
         .fromStream(stream)
         .on("data", function(data){
             if( rowNumber > 0 )
             {
                self.spread(self.objectFromArray(headers,data), rowNumber, headers, jobs, verbose);
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