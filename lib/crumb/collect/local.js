
const child_process = require('child_process');
const Node = require('./node')

class Local extends Node {
    constructor(saver) {
        super();
        this.saver = saver;
    }

    name()
    {
        return `local node`;
    }


    async execute(cmd, id, verbose)
    {
        let result = child_process.execSync(cmd);
        this.saver.save(result, id);
    }
}

module.exports = Local;