import mongoose from 'mongoose';

import Project from '../../models/Project.js';
import projectSeeds from './projects.json' assert { type: "json" };

const seedProjects = async () =>
{
  await Project.deleteMany({});
  await Project.insertMany(projectSeeds);
};

mongoose.connect('mongodb+srv://marcola88:egdb1122@urotasks.wwkpbcj.mongodb.net/');
seedProjects().then(() => {mongoose.connection.close();});