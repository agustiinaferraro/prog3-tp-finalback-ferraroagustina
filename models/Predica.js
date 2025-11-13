import mongoose from "mongoose";

const predicaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true }
});

const Predica = mongoose.model("Predica", predicaSchema);

export default Predica;