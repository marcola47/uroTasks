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
    require: true,
    maxlength: 7
  },

  activeTasks:
  {
    type: Number,
    default: -1
  },


  types: [typesSchema],

  tasks: [String],
  
  users: [String],

  created_at:
  {
    type: Date,
    default: new Date()
  }, 

  updated_at:
  {
    type: Date,
    default: new Date()
  }
}, { strict: false });

export default mongoose.model("Project", projectSchema);