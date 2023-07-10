import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

import Task from '../../models/Task.js';
import taskSeeds from './tasks.json' assert { type: "json" };

const seedProjects = async () =>
{

  await Task.deleteMany({});
  await Task.insertMany(taskSeeds);
};

const dbHost = process.env.DB_HOST;
mongoose.connect(dbHost);
seedProjects().then(() => {mongoose.connection.close();});