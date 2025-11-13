import mongoose from "mongoose";
const { Schema } = mongoose;

const actividadSchema = new Schema({
  ActividadNombre: { type: String, required: true },
  Seccion: { type: String, required: true },
  Portada: { type: String, required: true },
  Descripcion: { type: String, required: true },
  ImagenesActividades: [String],
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true }
}, { timestamps: true });

export default mongoose.model("Actividad", actividadSchema, "actividades");