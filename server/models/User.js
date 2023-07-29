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
    required: true
  },

  activeProject: 
  {
    type: String,
    ref: 'Project',
    default: null
  },
  
  projects: 
  {
    type: [String],
    ref: 'Project',
    default: []
  }
});

export default mongoose.model("User", userSchema);
