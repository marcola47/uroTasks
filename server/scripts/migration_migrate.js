import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { program } from 'commander';

async function runMigration(fileName, direction) 
{
  const migrationPath = fileURLToPath(new URL(`../db/migrations/${fileName}`, import.meta.url));

  try 
  {
    const migrationURL = pathToFileURL(migrationPath);

    const migrationModule = await import(migrationURL);
    const migrationFunction = direction === 'down' ? migrationModule.default?.down : migrationModule.default?.up;

    if (typeof migrationFunction === 'function') 
    {
      const migrationsFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations.json');
      const executedMigrations = JSON.parse(await fs.readFile(migrationsFile, 'utf-8'));

      if (direction === 'up' && !executedMigrations.includes(fileName)) 
      {
        console.log(`Running up migration for: ${fileName}`);
        await migrationFunction();

        executedMigrations.push(fileName);
        await fs.writeFile(migrationsFile, JSON.stringify(executedMigrations, null, 2));
      } 
      
      else if (direction === 'down' && executedMigrations.includes(fileName)) 
      {
        console.log(`Running down migration for: ${fileName}`);
        await migrationFunction();

        const index = executedMigrations.indexOf(fileName);
        executedMigrations.splice(index, 1);
        await fs.writeFile(migrationsFile, JSON.stringify(executedMigrations, null, 2));
      } 
      
      else 
        console.log(`Skipping migration file: ${fileName}`);
    } 
    
    else 
      console.log(`Skipping invalid migration file: ${fileName}`);
  } 
  
  catch (err) {
    console.error(`Error running ${direction} migration ${fileName}:`, err);
  }
}

async function runAllMigrations(direction) 
{
  try 
  {
    const migrationDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'db', 'migrations');
    const migrationFiles = await fs.readdir(migrationDir);

    const sortedMigrationFiles = migrationFiles.sort((a, b) => 
    {
      const timestampA = parseInt(a.split('_')[0], 10);
      const timestampB = parseInt(b.split('_')[0], 10);
      return direction === 'up' ? timestampA - timestampB : timestampB - timestampA;
    });

    for (const fileName of sortedMigrationFiles) 
      await runMigration(fileName, direction);
  } 
  
  catch (err) {
    console.error(`Error reading migration files for ${direction} migrations:`, err);
  }
}

program
  .arguments('<direction>')
  .action((direction) => 
  {
    if (direction === 'up' || direction === 'down') 
      runAllMigrations(direction);
    
    else 
      console.error('Invalid direction. Please provide "up" or "down" as the command line argument.');
  })
  .parse(process.argv);
