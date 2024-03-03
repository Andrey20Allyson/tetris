const { program } = require("commander");

const buildDevCommand = program
  .command('build:dev')
  .option('-s, --serve', 'Serve the public dir')
  .action(() => require('./build-dev.action').call(buildDevCommand));

program.command('build:prod')

program.parse();