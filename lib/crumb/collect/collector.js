const fs   = require('fs');
const yaml = require('js-yaml');
const csv  = require('fast-csv');
const firstline = require('firstline')
const child_process = require('child_process');
const chalk = require('chalk');

class Collector {
    constructor(saver, nodes) {
        this.nodes = nodes;
        this.saver = saver;
    }

    async load(jobs, input_csv) {
        //let jobs = yaml.safeLoad(fs.readFileSync(jobs_yml))
        //console.log(jobs);

        this.spreadFromFile( jobs, input_csv);
    }

    fillTemplate(jobs, headers, row)
    {
        
        // Replace $id, etc. in job
        let step=jobs.job;
        //for( var step of jobs.job )
        {
            for( var header of headers )
            {
                let regex = new RegExp(`[$]${header}`, 'g');
                step = step.replace(regex, row[header] )
            }
            
            console.log( step );
            //steps.push( step );
        }
        return step;
        //return steps;
    }

    runJob(node, step, id,data)     
    {
        
        //for( let step of steps )
        {
            
            //added an error handler for the commits without any results
            try{
            let result = child_process.execSync(step);
            result=result.toString('utf8');
            let files=result.split(/\r?\n/);
            
            for(let file of files)
            {                
                if(file.includes('.js') && !file.includes('.json'))
                {
                    this.saver.save(file, data.owner, data.repo_name, data.build_commit_sha, data.author_name, data.commit_time);
                    console.log(file, data.owner, data.repo_name, data.build_commit_sha, data.author_name, data.commit_time);
                }
            }
        } catch(err){
//                console.log("Errors:",err);
            }
        }
    }

    spread(data, rowNumber, headers, jobs) {
        // broadcast to all nodes.
        let lucky = rowNumber % this.nodes.length;
        console.log(`Sending ${JSON.stringify(data)} to ${lucky}`);
        let steps = this.fillTemplate(jobs, headers, data);
        this.runJob(lucky, steps, rowNumber, data)
    }

    async spreadFromFile(jobs, input_csv)
    {
        let self = this;
        let headers = await firstline(input_csv)
        headers = headers.replace(/\r/gm,'');
        headers = headers.split(',');
        
        console.log( headers );
        this.saver.save('file_name', 'owner', 'repo_name', 'build_commit_sha', 'author_name', 'commit_time');

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