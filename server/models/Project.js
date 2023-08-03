import mongoose from "mongoose";
import idSchema from './_id.js';

import { v4 as uuid } from 'uuid';
 
const typesSchema = new mongoose.Schema(
{
  id:
  {
    type: String,
    default: uuid,
    required: true
  },

  name:
  {
    type: String,
    required: true
  },

  position: Number
}, { _id : false });

const tagsSchema = new mongoose.Schema(
{
  id:
  {
    type: String,
    default: uuid,
    required: true
  },

  name:
  {
    type: String,
    required: true
  },

  color:
  {
    type: String,
    maxlength: 7,
    default: '#ffffff',
    required: true
  },

  position: Number
}, { _id : false })

const projectSchema = new mongoose.Schema(
{
  id: idSchema,

  name: 
  { 
    type: String, 
    required: true,
    maxlength: 128
  },
  
  color: 
  { 
    type: String, 
    required: true,
    maxlength: 7
  },

  activeTasks:
  {
    type: Number,
    default: -1
  },

  types:
  { 
    type: [typesSchema],
    maxlength: 1024
  },

  tags:
  {
    type: [tagsSchema],
    maxlength: 1024
  },

  tasks: 
  {
    type: [String],
    maxlength: 2048
  },
  
  users:
  {
    type: [String],
    maxlength: 1024
  },

  created_at:
  {
    type: Date,
    default: Date.now
  }, 

  updated_at:
  {
    type: Date,
    default: Date.now
  }
}, { strict: false });

export default mongoose.model("Project", projectSchema);