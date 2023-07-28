import fs from 'fs/promises';
import { fileURLToPath } from 'url';

async function createMigrationFile(name) 
{
  const date = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
  const fileName = `${date}_${name}.js`;

  const migrationContent = 
  `import mongoose from 'mongoose';

  // Define/import your schema here
  // const new_migrationSchema = new mongoose.Schema({ ... });

  export default 
  {
    up: async function() 
    {
      // Add migration logic to be executed when migrating up
    },

    down: async function() 
    {
      // Add migration logic to be executed when migrating down
    }
  };`;

  const migrationPath = fileURLToPath(new URL(`../db/migrations/${fileName}`, import.meta.url));

  try 
  {
    await fs.writeFile(migrationPath, migrationContent, 'utf-8');
    console.log('Migration file created successfully:', fileName);
  } 
  
  catch (err) {
    console.error('Error creating migration file:', err);
  }
}

const migrationName = process.argv[2];

if (!migrationName) 
  console.error('Please provide a migration name as a command line argument.');

else 
  createMigrationFile(migrationName);
