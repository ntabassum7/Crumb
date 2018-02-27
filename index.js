const yargs = require('yargs');

const Stats = require('./lib/crumb/stats');

// Register run command
yargs.command('collect <jobs_yml>', 'Run collection jobs', (yargs) => {

    yargs.positional('jobs_yml', {
        describe: 'Job description file',
        type: 'string'
    });

}, async (argv) => {
    let jobs_yml = argv.jobs_yml;
    console.log( jobs_yml );
});

yargs.command('export <id>', 'Export data from completed jobs', (yargs) => {

    yargs.positional('id', {
        describe: 'Jobs slug',
        type: 'string'
    });

}, async (argv) => {
    let id = argv.id;
    console.log( id );
});

yargs.command('stats <id>', 'Collect statistics from running jobs', (yargs) => {

    yargs.positional('id', {
        describe: 'Jobs slug',
        type: 'string'
    });

}, async (argv) => {
    let id = argv.id;
    console.log( id );

    let stats = new Stats();

    let data = [
        {node: 'whiterose', jobs: 30, done: 10},
        {node: 'mr.robot', jobs: 30, done: 6},
        {node: 'darlene', jobs: 30, done: 15},
        {node: 'gideon', jobs: 30, done: 0}
    ];

    console.log( stats.renderTable(data) );


});

// Turn on help and access argv
yargs.help().argv;