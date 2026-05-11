import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  const fileId = process.env.CALENDARIO_FILE_ID;

  if (!fileId) {
    return res.status(404).json({ message: "No hay calendario configurado" });
  }

  try {
    const driveUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    res.redirect(driveUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la imagen del calendario" });
  }
});

export default router;
