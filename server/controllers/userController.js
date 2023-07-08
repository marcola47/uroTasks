import bcrypt from 'bcrypt';

import User from '../models/User.js'
const userController = {};

/*****************************************************************************************************************/
userController.login = async (req, res) => 
{
  const userData = req.body;

  try 
  {
    const user = await User.findOne({ email: userData.email });

    if (!user) 
      return res.status(400).send('Invalid email or password, make sure to type them correctly!');
    
    const match = await bcrypt.compare(userData.password, user.password);

    if (!match) 
      return res.status(400).send('Invalid email or password, make sure to type them correctly!');

    res.status(200).send(user);
  } 

  catch (error) 
  {
    console.error("Error during login:", error);
    res.status(500).send("Error logging in");
  }
};

/*****************************************************************************************************************/
userController.create = async (req, res) => 
{
  const userData = req.body;
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) 
    return res.status(400).send("Email already in use");

  try 
  {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({ ...userData, password: hashedPassword });
    await newUser.save();

    res.sendStatus(201);
    console.log(`${new Date()}: Successfully created user ${user.name}`);
  }
  
  catch (error) 
  {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
};

/*****************************************************************************************************************/
userController.updateActiveProject = async (userID, projectID) => 
{
  await User.updateOne({ id: userID }, { activeProject: projectID }); 
  console.log(`${new Date()}: successfully updated user's active project to |${projectID}|`);
}

/*****************************************************************************************************************/
userController.updateProjectList = async (userID, projectID, method) => 
{
  const updatedUser = {};

  if (method === 'add') 
  {
    updatedUser.$push = { projects: projectID };
    updatedUser.$set = { activeProject: projectID };
    console.log(`${new Date()}: Successfully added project to list`);
  } 

  else if (method === 'delete') 
  {
    updatedUser.$pull = { projects: projectID };
    updatedUser.$set = { activeProject: '0' };
    console.log(`${new Date()}: Successfully removed project from list`);
  } 
  
  else 
    throw new Error('Invalid method');

  await User.updateOne({ id: userID }, updatedUser);
};

export default userController;