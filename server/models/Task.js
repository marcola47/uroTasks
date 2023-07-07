import mongoose from "mongoose";
import idSchema from './_id.js';

const taskSchema = new mongoose.Schema(
{
  id: idSchema,

  type: String,
  
  position: Number,

  project: String,

  tags: [String],

  content:
  {
    type: String,
    maxlength: 1024
  },

  start_date:
  {
    type: Date,
    default: null,
    required: false
  },

  due_date:
  {
    type: Date,
    default: null,
    required: false
  },

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

export default mongoose.model("Task", taskSchema);