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
    required: true,
    maxlength: 512
  },

  position: 
  {
    type: Number,
    required: true
  }
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
    required: true,
    maxlength: 512
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
    maxlength: 256
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
    default: -1,
    required: false
  },

  types:
  { 
    type: [typesSchema],
    default: [],
    required: false,
    maxlength: 1024
  },

  tags:
  {
    type: [tagsSchema],
    default: [],
    required: false,
    maxlength: 1024
  },

  tasks: 
  {
    type: [String],
    default: [],
    required: false,
    maxlength: 2048
  },
  
  users:
  {
    type: [String],
    default: [],
    required: false,
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