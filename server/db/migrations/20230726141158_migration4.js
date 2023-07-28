import mongoose from 'mongoose';

// Define/import your schema here
// const new_migrationSchema = new mongoose.Schema({ ... });

export default 
{
  up: async function() 
  {
    console.log('up migration4')
  },

  down: async function() 
  {
    console.log('down migration4')
  }
};