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

    save(filename, owner, repo_name, id, author, commit_time) {
        let dest = path.resolve(this.store, `filenames_author_tenure.csv`);
        //let dest = path.resolve(this.store, `${id}.txt`);
        console.log( chalk.magenta(`output written to ${dest}`) );
        fs.writeFileSync( dest, `${owner},${repo_name},${id},${author},${filename},${commit_time}\n`, {flag:'a'})
        //fs.writeFileSync( dest, `${content}`, {flag:'w'})
    }

}

module.exports = DiskSaver;