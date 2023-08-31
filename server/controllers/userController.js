import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Token from '../models/Token.js';

const userController = {};

userController.token = async (req, res) =>
{
  try
  {
    const user = await User.findOne({ id: req.body.userID });

    user.password = null;
    res.status(200).json({ auth: true, accessToken: req.body.accessToken, result: user });
  }

  catch (error)
  {
    console.error(error);
    res.status(500).json(
    { 
      header: "Failed to get user",
      message: "Internal server error on getting user" 
    });
  }
};

userController.login = async (req, res) => 
{
  const userData = req.body;

  try 
  {
    const user = await User.findOne({ email: userData.email });
    if (!user)
    {
      return res.status(400).json(
      { 
        header: "Failed to login", 
        message: 'Invalid email or password, make sure to type them correctly!'
      });
    }

    
    const match = await bcrypt.compare(userData.password, user.password);
    if (!match)
    {
      return res.status(400).json(
      { 
        header: "Failed to login", 
        message: 'Invalid email or password, make sure to type them correctly!'
      });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH, { expiresIn: '30d' })
    
    await Token.create({ token: refreshToken, userID: user.id })
    .catch(err => console.log(err))

    user.password = null;
    res.status(200).json({ auth: true, result: user, accessToken: accessToken, refreshToken: refreshToken });
  } 

  catch (error) 
  {
    console.error("Error during login:", error);
    res.status(500).send(
    {
      header: "Failed to log in", 
      message: "Internal server error on logging in" 
    });
  }
};

userController.logout = async (req, res) => 
{
  try 
  {
    const userID = req.body.userID;
    const refreshToken = req.body.refreshToken
    
    await Token.findOneAndDelete({ token: refreshToken, userID: userID });
    res.status(200).json({ message: "Logout successful" });
  }

  catch (error)
  {
    console.error(error);
    res.status(500).json(
    { 
      header: "Failed to log out",
      message: "Internal server error on logging out" 
    });
  }
};

userController.create = async (req, res) => 
{
  const userData = req.body;

  if (await User.findOne({ email: userData.email })) 
    return res.status(400).send({ header: "Failed to register", message: "Email already in use" });

  const session = await mongoose.startSession();
  session.startTransaction();

  try 
  {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({ ...userData, password: hashedPassword });
    await User.create(newUser);

    const accessToken = jwt.sign({ id: newUser.id }, process.env.JWT_ACCESS, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: newUser.id }, process.env.JWT_REFRESH, { expiresIn: '30d' })
    await Token.create({ token: refreshToken, userID: newUser.id })

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({ accessToken: accessToken, refreshToken: refreshToken });
    console.log(`${new Date()}: Successfully created user ${newUser.name}`);
  }
  
  catch (error) 
  {
    await session.abortTransaction();
    await session.endSession();

    console.error("Error creating user:", error);
    res.status(500).send(
    {
      header: "Failed to register", 
      message: "Internal server error on creating user" 
    });
  }
};

userController.updateActiveProject = async (req, res) => 
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { userID, projectID } = req.body;

    await User.updateOne
    (
      { id: userID }, 
      { activeProject: projectID }
    );
    
    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated active project`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();
    
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to update active project",
      message: "Internal server error on updating active project" 
    })
  }
}

export default userController;