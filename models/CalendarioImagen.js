import mongoose from "mongoose";

const calendarioImagenSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const CalendarioImagen = mongoose.model("CalendarioImagen", calendarioImagenSchema);

export default CalendarioImagen;
