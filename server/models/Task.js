import mongoose from "mongoose";
import idSchema from './_id.js';

const taskSchema = new mongoose.Schema(
{
  id: idSchema,

  position:
  {
    type: Number,
    required: true
  },

  type: 
  {
    type: String,
    required: true
  },

  project: 
  {
    type: String,
    required: true
  },

  tags: 
  {
    type: [String],
    default: [],
    required: false
  },

  archived:
  {
    type: Boolean,
    default: false
  },

  content:
  {
    type: String,
    required: true,
    maxlength: 1024
  },

  completed:
  {
    type: Boolean,
    default: false,
    required: false
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
    default: Date.now
  }, 

  updated_at:
  {
    type: Date,
    default: Date.now
  }
}, { strict: false });

taskSchema.index({ id: 1 }, { unique: true });

export default mongoose.model("Task", taskSchema);