const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const Saver = require('./saver');

class DiskSaver extends Saver {

    constructor(store) {
        super();
        this.store = store;

        if( !fs.existsSync(this.store) )
        {
            fs.mkdirSync(this.store);
        }
    }

    save(content, id) {
        let dest = path.resolve(this.store, `${id.toString()}.crumb`);
        console.log( chalk.magenta(`output written to ${dest}`) );
        fs.writeFileSync( dest, content )
    }

}

module.exports = DiskSaver;