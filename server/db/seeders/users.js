import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
config();

import User from '../../models/User.js';
import userSeeds from './users.json' assert { type: "json" };

const seedProjects = async () => 
{
  await User.deleteMany({});

  for (const userSeed of userSeeds) 
  {
    const hash = await bcrypt.hash(userSeed.password, 10);

    const user = new User(
    {
      id: userSeed.id,
      name: userSeed.name,
      email: userSeed.email,
      password: hash,
      projects: userSeed.projects,
    });

    await user.save();
  }

  console.log('User seeding completed.');
};

const dbHost = process.env.DB_HOST;
mongoose.connect(dbHost);
seedProjects().then(() => {mongoose.connection.close();});