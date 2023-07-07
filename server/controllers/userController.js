import bcrypt from 'bcrypt';

import User from '../models/User.js'
const userController = {};

/*****************************************************************************************************************/
userController.login = async (userEmail, userPassword) => 
{
  const user = await User.findOne({ email: userEmail });
  if (user === null) return null;

  const match = await bcrypt.compare(userPassword, user.password);
  if (!match) return null;

  return user;
}

/*****************************************************************************************************************/
userController.create = async (userData) => 
{
  const hash = await bcrypt.hash(userData.password, 10);
  const user = new User({ ...userData, password: hash });
  user.save();

  console.log(`${new Date()}: successfully created user ${user.name}`);
}

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