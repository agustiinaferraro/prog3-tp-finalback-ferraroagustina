import { Router } from "express";
import multer from "multer";
import CalendarioImagen from "../models/CalendarioImagen.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
  try {
    const imagen = await CalendarioImagen.findOne().sort({ updatedAt: -1 });
    if (!imagen) {
      return res.status(404).json({ message: "No hay imagen de calendario disponible" });
    }
    res.setHeader("Content-Type", imagen.contentType);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.send(imagen.data);
  } catch (error) {
    console.error("Error al obtener imagen:", error);
    res.status(500).json({ message: "Error al obtener la imagen del calendario" });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No se envió ninguna imagen" });
    }

    await CalendarioImagen.findOneAndUpdate(
      {},
      {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        updatedAt: new Date()
      },
      { upsert: true }
    );

    res.json({ message: "Imagen de calendario actualizada correctamente" });
  } catch (error) {
    console.error("Error al subir imagen:", error);
    res.status(500).json({ message: "Error al subir la imagen" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const password = req.query.password || req.headers["x-admin-password"];
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    await CalendarioImagen.deleteMany({});
    res.json({ message: "Imagen eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar imagen:", error);
    res.status(500).json({ message: "Error al eliminar la imagen" });
  }
});

export default router;
