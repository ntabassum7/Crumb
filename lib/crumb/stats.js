const chalk = require('chalk');
const Table = require('cli-table');


class Stats {
  constructor() {
  }

  static label(text) 
  {
    return chalk.magenta(text);      
  }

  /**
   * Constructors a bar chart for the % usage of each value.
   * @return {string}
   */
  barGraph(stats) {
    const maxBarWidth = 30;

    const completed = ' '.repeat((stats.done / stats.jobs) * maxBarWidth);
    const remaining = ' '.repeat(( (stats.jobs - stats.done) / stats.jobs) * maxBarWidth);

    return chalk.bgBlueBright(completed) + chalk.bgBlackBright(remaining);
  }


  renderTable(jobStats) {

    const table = new Table({
        head: [
          'Node',
          `${chalk.bgBlueBright(' Completed ')} / ${chalk.bgBlackBright(' Incompleted ')} % Jobs`,
          'Some text'
        ],
        style: {head: ['white'], border: ['grey']}
      });

    for( const stats of jobStats )
    {
        table.push([
            Stats.label(stats.node),
            this.barGraph(stats),
            'some text'
        ]);
    }

    return table.toString();
  }

}

module.exports = Stats;