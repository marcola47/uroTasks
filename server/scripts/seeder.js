import fs from 'fs/promises';
import path from 'path';
import { program } from 'commander';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory path of the current file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runSeeder(file) 
{
  const seederPath = path.join(__dirname, '../', 'db', 'seeders', `${file}.js`);

  try 
  {
    await fs.access(seederPath);
    const child = spawn('node', [seederPath]);

    child.stdout.on('data', (data) => { console.log(data.toString()) });
    child.stderr.on('data', (data) => { console.error(data.toString()) });

    child.on('close', (code) => { console.log(`Seeder process exited with code ${code}`) });
  } 
  
  catch (err) {
    console.error('Error running seeder:', err);
  }
}

async function runAllSeeders() 
{
  try 
  {
    const seederDir = path.join(__dirname, '../', 'db', 'seeders');
    const seederFiles = await fs.readdir(seederDir);

    for (const file of seederFiles) 
      if (file.endsWith('.js')) 
        await runSeeder(file.slice(0, -3));
  } 
  
  catch (err) {
    console.error('Error reading seeder files:', err);
  }
}

program
  .command(': <file>')
  .description('Run a seeder file or all seeders if <file> is "all"')
  .action(async (file) => 
  {
    if (file === 'all') 
      await runAllSeeders();
    
    else 
      await runSeeder(file);
  });

program.parse(process.argv);

// running script: 
//  npm run seed <seeder_file>
//  npm run seed all