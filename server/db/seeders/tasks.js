import mongoose from 'mongoose';

import Task from '../../models/Task.js';
import taskSeeds from './tasks.json' assert { type: "json" };

const seedProjects = async () =>
{
  await Task.deleteMany({});
  await Task.insertMany(taskSeeds);
};

mongoose.connect('mongodb+srv://marcola88:egdb1122@urotasks.wwkpbcj.mongodb.net/');
seedProjects().then(() => {mongoose.connection.close();});