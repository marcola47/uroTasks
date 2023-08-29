import mongoose from 'mongoose';

import Project from '../models/Project.js';
import Task from '../models/Task.js';

const tagsController = {};

tagsController.create = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, newTag } = req.body;

    await Project.updateOne
    (
      { id: projectID },
      { 
        $set: { updated_at: Date.now() },
        $push: { tags: newTag }
      }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(201).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project tags`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();
    
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to create project",
      message: "Internal server error on creating project" 
    })
  }
}

tagsController.updateContent = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, tagID, tagName, tagColor } = req.body;

    await Project.updateOne
    (
      { id: projectID, 'tags.id': tagID }, 
      { $set: { 'tags.$.name': tagName, 'tags.$.color': tagColor, updated_at: Date.now() } }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project tags`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();
    
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to create project",
      message: "Internal server error on creating project" 
    })
  }
}

tagsController.updatePosition = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, tagID, params } = req.body;
    const tagList = (await Project.findOne({ id: projectID }).select('tags -_id')).tags;
    const positions = { old: params.sourcePosition, new: params.destinationPosition };
    
    tagList.forEach(listTag => 
    {
      const isBetween =
        listTag.position >= Math.min(positions.old, positions.new) && 
        listTag.position <= Math.max(positions.old, positions.new)
  
      if (listTag.id === tagID) 
        listTag.position = positions.new;
      
      else if (listTag.id !== tagID && isBetween)
        listTag.position += positions.new > positions.old ? -1 : 1;
    });

    await Project.updateOne
    (
      { id: projectID }, 
      { $set: { tags: tagList } }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project tags`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();

    console.log(error);
    res.status(500).send(
    {
      header: "Failed to create project",
      message: "Internal server error on creating project"
    })
  }
}

tagsController.delete = async (req, res) =>
{
  const session = await mongoose.startSession();
  session.startTransaction();

  try
  {
    const { projectID, tagID } = req.body;
    
    await Task.updateMany
    (
      { project: projectID, tags: { $elemMatch: { $eq: tagID } } }, 
      { $pull: { tags: tagID } }, 
      { multi: true, session },
    );

    await Project.updateOne
    (
      { id: projectID, 'tags.id': tagID },
      { 
        $pull: { tags: { id: tagID } }, 
        $set: { updated_at: Date.now() } 
      }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(200).send({ newAccessToken: req.newAccessToken });
    console.log(`${new Date()}: successfully updated project tags`);
  }

  catch (error)
  {
    await session.abortTransaction();
    await session.endSession();
    
    console.log(error);
    res.status(500).send(
    {
      header: "Failed to create project",
      message: "Internal server error on creating project" 
    })
  }
}

export default tagsController;