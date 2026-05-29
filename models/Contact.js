import { Schema, model } from "mongoose";

const contactSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  telefono: { type: String, required: true },
  necesidad: { type: String, required: true },
}, { timestamps: true });

export default model("Contact", contactSchema);
