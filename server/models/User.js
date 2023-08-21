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
    required: true
  },

  settings:
  {
    date_format:
    {
      type: String,
      enum: ['d/m/y', 'm/d/y', 'y/m/d'],
      default: 'd/m/y',
      required: true
    },

    open_last_proj:
    {
      type: Boolean,
      default: true,
      required: true
    },

    save_general_ordering:
    {
      type: Boolean,
      default: true,
      required: true
    },

    open_last_used_project:
    {
      type: Boolean,
      default: true,
      required: true
    },

    display_tasks_per_type:
    {
      type: Boolean,
      default: false,
      required: true
    }, 

    display_task_position:
    {
      type: Boolean,
      default: false,
      required: true
    },

    display_task_list_position:
    {
      type: Boolean,
      default: false,
      required: true
    }
  }
});

userSchema.index({ id: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
