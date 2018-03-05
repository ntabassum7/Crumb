const yargs = require('yargs');

const Crumb = require('./lib/crumb/crumb');
const Stats = require('./lib/crumb/stats');
const DiskSaver = require('./lib/crumb/save/disk');
const Collector = require('./lib/crumb/collect/collector');

// Register run command
yargs.command('start <baker_yml>', 'Setup cluster', (yargs) => {

    yargs.positional('baker_yml', {
        describe: 'Baker description file',
        type: 'string'
    });

}, async (argv) => {
    let baker_yml = argv.baker_yml;
    console.log( baker_yml );
});

// Register run command
yargs.command('collect <jobs_yml> <input_csv>', 'Run collection jobs on input.csv', (yargs) => {

    yargs.positional('jobs_yml', {
        describe: 'Job description file',
        type: 'string'
    });

    yargs.positional('input_csv', {
        describe: 'Every row corresponds to one job',
        type: 'string'
    });

    yargs.options(
        { 
            verbose: {
                alias: 'v',
                describe: `Provide extra output from baking process`,
                demand: false,
                type: 'boolean'
            }
        }
    );

}, async (argv) => {
    let jobs_yml = argv.jobs_yml;
    let input_csv = argv.input_csv;
    let verbose = argv.verbose;
    
    try
    {
        let crumb = new Crumb(jobs_yml);
        let collector = await crumb.initCollector();
        await collector.load(crumb.jobs, input_csv, verbose);
    }
    catch(err)
    {
        console.log(chalk.red(err));
    }

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