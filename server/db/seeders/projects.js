import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

import Project from '../../models/Project.js';
import projectSeeds from './projects.json' assert { type: "json" };

const seedProjects = async () =>
{
  await Project.deleteMany({});
  await Project.insertMany(projectSeeds);
};

const dbHost = process.env.DB_HOST;
mongoose.connect(dbHost);
seedProjects().then(() => {mongoose.connection.close();});