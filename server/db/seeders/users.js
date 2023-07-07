import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

mongoose.connect('mongodb+srv://marcola88:egdb1122@urotasks.wwkpbcj.mongodb.net/');
seedProjects().then(() => {mongoose.connection.close();});