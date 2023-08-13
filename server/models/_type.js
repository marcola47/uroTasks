import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

const typeSchema = new mongoose.Schema(
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
}, { _id : false });

export default typeSchema;