import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
{
  token:
  {
    type: String,
    required: true
  },

  userID:
  {
    type: String,
    required: true
  }
});

export default mongoose.model("Token", tokenSchema);