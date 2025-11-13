// routes/actividades.js
import express from "express";
import Actividad from "../models/Actividad.js";

const router = express.Router();

// Obtener todas las actividades
router.get("/", async (req, res) => {
  try {
    const actividades = await Actividad.find().populate("category", "name slug");
    res.json(actividades);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las actividades", error });
  }
});

// Obtener actividad por id
router.get("/:id", async (req, res) => {
  try {
    const actividad = await Actividad.findById(req.params.id).populate("category", "name slug");
    if (!actividad) return res.status(404).json({ message: "Actividad no encontrada" });
    res.json(actividad);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la actividad", error });
  }
});

// Crear nueva actividad
router.post("/", async (req, res) => {
  try {
    const { ActividadNombre, Seccion, Portada, Descripcion, ImagenesActividades, category } = req.body;

    if (!ActividadNombre || !Seccion || !Portada || !Descripcion || !category) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const nuevaActividad = new Actividad({
      ActividadNombre,
      Seccion,
      Portada,
      Descripcion,
      ImagenesActividades: ImagenesActividades || [],
      category
    });

    await nuevaActividad.save();
    res.status(201).json(nuevaActividad);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la actividad", error });
  }
});

// Actualizar actividad completa
router.put("/:id", async (req, res) => {
  try {
    const { ActividadNombre, Seccion, Portada, Descripcion, ImagenesActividades, category } = req.body;

    if (!ActividadNombre || !Seccion || !Portada || !Descripcion || !category) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const actividadActualizada = await Actividad.findByIdAndUpdate(
      req.params.id,
      {
        ActividadNombre,
        Seccion,
        Portada,
        Descripcion,
        ImagenesActividades: ImagenesActividades || [],
        category
      },
      { new: true }
    );

    if (!actividadActualizada) return res.status(404).json({ message: "Actividad no encontrada" });

    res.json({ message: "Actividad actualizada", actividad: actividadActualizada });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la actividad", error });
  }
});

export default router;
