import mongoose from "mongoose";
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobPhone: {
    type: String,
    required: true,
  },
  email: String,
});

export const Contact = mongoose.model("Contact", contactSchema);
