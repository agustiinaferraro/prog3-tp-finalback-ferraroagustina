import { Router } from "express";
import axios from "axios";

const router = Router();

const FOLDER_ID = process.env.CALENDARIO_FOLDER_ID || "1aNBdgeJWUk-JDmTto3Y_nukO9yIji4Kt";
const API_KEY = process.env.GOOGLE_API_KEY;

router.get("/", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ message: "GOOGLE_API_KEY no configurada" });
  }

  try {
    const url = "https://www.googleapis.com/drive/v3/files";
    const params = {
      q: `'${FOLDER_ID}' in parents and mimeType contains 'image/'`,
      orderBy: "createdTime desc",
      pageSize: 1,
      fields: "files(id, name, mimeType)",
      key: API_KEY,
    };

    const response = await axios.get(url, { params });
    const files = response.data.files;

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No hay imágenes en la carpeta" });
    }

    const fileId = files[0].id;
    const imageUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    res.redirect(imageUrl);
  } catch (error) {
    console.error("Error al obtener imagen de Drive:", error?.response?.data || error.message);
    res.status(500).json({ message: "Error al obtener la imagen del calendario" });
  }
});

export default router;
