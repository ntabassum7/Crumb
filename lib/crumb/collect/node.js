
const child_process = require('child_process');
const chalk = require('chalk');

class Node {
    constructor(saver) {
        this.saver = saver;
    }

    name()
    {
        throw new Error("Must override");
    }

    async run(steps, id, verbose)
    {
        for( let step of steps )
        {
            try
            {
                await this.execute(step, id, verbose);
            }
            catch(err)
            {
                console.log(chalk.grey(err.stack));                
            }
        }
    }

    async execute()
    {
        throw new Error("Must override");
    }
}


module.exports = Node;