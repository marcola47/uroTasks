import mongoose from "mongoose";
import { v4 as uuid } from 'uuid';

const tagSchema = new mongoose.Schema(
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
}, { _id : false })

export default tagSchema;