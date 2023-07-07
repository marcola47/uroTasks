import { program } from 'commander';
import { spawn } from 'child_process';

program
  .command('seed <file>')
  .description('Run a seeder file')
  .action((file) => 
  {
    const path = `db/seeders/${file}.js`;
    const child = spawn('node', [path]);

    child.stdout.on('data', (data) => {console.log(data.toString())});
    child.stderr.on('data', (data) => {console.error(data.toString())});

    child.on('close', (code) => {console.log(`Seeder process exited with code ${code}`)});
  });

program.parse(process.argv);