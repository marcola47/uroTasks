import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import Token from '../models/Token.js';

const userController = {};

/*****************************************************************************************************************/
userController.token = async (req, res) =>
{
  const user = await User.findOne({ id: req.body.userID });

  user.password = null;
  res.status(200).json({ auth: true, accessToken: req.body.accessToken, result: user });
};

/*****************************************************************************************************************/
userController.login = async (req, res) => 
{
  const userData = req.body;

  try 
  {
    const user = await User.findOne({ email: userData.email });

    if (!user) 
      return res.status(400).json({ auth: false, message: 'Invalid email or password, make sure to type them correctly!'});
    
    const match = await bcrypt.compare(userData.password, user.password);

    if (!match) 
      return res.status(400).json({ auth: false, message: 'Invalid email or password, make sure to type them correctly!'});

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCESS, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH, { expiresIn: '30d' })
    
    await Token.create({ token: refreshToken, userID: user.id })
      .catch(err => console.log(err))

    user.password = null;
    res.status(200).json({ auth: true, accessToken: accessToken, refreshToken: refreshToken, result: user });
  } 

  catch (error) 
  {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Internal server error logging in" });
  }
};

/*****************************************************************************************************************/
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
    res.status(500).json({ message: "Error logging out" });
  }
};

/*****************************************************************************************************************/
userController.create = async (req, res) => 
{
  const userData = req.body;

  if (await User.findOne({ email: userData.email })) 
    return res.status(400).send({ header: "Failed to register", message: "Email already in use" });

  try 
  {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();

    const accessToken = jwt.sign({ id: newUser.id }, process.env.JWT_ACCESS, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: newUser.id }, process.env.JWT_REFRESH, { expiresIn: '30d' })
    
    await Token.create({ token: refreshToken, userID: newUser.id })
      .catch(err => console.log(err))

    res.status(201).json({ auth: true, accessToken: accessToken, refreshToken: refreshToken });
    console.log(`${new Date()}: Successfully created user ${newUser.name}`);
  }
  
  catch (error) 
  {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Internal server error on creating user" });
  }
};

/*****************************************************************************************************************/
userController.updateActiveProject = async (req, res) => 
{
  const data = req.body;

  await User.updateOne({ id: data.userID }, { activeProject: data.projectID }); 
  console.log(`${new Date()}: successfully updated user's active project to |${data.projectID}|`);
}

/*****************************************************************************************************************/
userController.updateProjectList = async (req, res) => 
{
  const method = req.query.method;
  const data = req.body;

  const updatedUser = {};

  if (method === 'add') 
  {
    updatedUser.$push = { projects: data.projectID };
    updatedUser.$set = { activeProject: data.projectID };
    console.log(`${new Date()}: Successfully added project to list`);
  } 

  else if (method === 'delete') 
  {
    updatedUser.$pull = { projects: data.projectID };
    updatedUser.$set = { activeProject: '0' };
    console.log(`${new Date()}: Successfully removed project from list`);
  } 
  
  else 
    throw new Error('Invalid method');

  await User.updateOne({ id: data.userID }, updatedUser);
};

/*****************************************************************************************************************/
userController.update = async (req, res) =>
{
  try 
  {
    const type = req.query.type;
  
    if (type === 'activeProject')
      await userController.updateActiveProject(req, res);
  
    else if (type === 'projectList')
      await userController.updateProjectList(req, res);
  
    res.sendStatus(200);
  }

  catch (error)
  {
    console.log(error);
    res.status(500).send({ message: "Error on updating user data" })
  }
}

export default userController;