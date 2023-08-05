import mongoose from "mongoose";

import idSchema from './_id.js';
import tagSchema from "./_tag.js";
import typeSchema from "./_type.js";

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
    type: [typeSchema],
    default: [],
    required: false,
    maxlength: 1024
  },

  tags:
  {
    type: [tagSchema],
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