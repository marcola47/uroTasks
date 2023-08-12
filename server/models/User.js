import mongoose from "mongoose";
import idSchema from './_id.js';

const userSchema = new mongoose.Schema(
{
  id: idSchema,

  name: 
  { 
    type: String, 
    required: true,
    maxlength: 64
  }, 

  email: 
  {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please provide a valid email address.']
  },

  password:
  {
    type: String,
    required: true,
    minlength: 8
  },

  activeProject: 
  {
    type: String,
    ref: 'Project',
    default: null,
    required: false
  },
  
  projects: 
  {
    type: [String],
    ref: 'Project',
    default: [],
    required: false
  },

  settings:
  {
    date_format:
    {
      type: String,
      enum: ['d/m/y', 'm/d/y', 'y/m/d'],
      default: 'd/m/y',
      required: false
    },

    open_last_proj:
    {
      type: Boolean,
      default: true,
      required: false
    }
  }
});

export default mongoose.model("User", userSchema);
