// routes/predicas.js
import express from "express";
import Predica from "../models/Predica.js";

const router = express.Router();

// get todas las predicas
router.get("/", async (req, res) => {
  try {
    const predicas = await Predica.find();
    res.json(predicas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener prédicas" });
  }
});

// get por id
router.get("/:id", async (req, res) => {
  try {
    const predica = await Predica.findById(req.params.id);
    if (!predica) return res.status(404).json({ error: "No encontrada" });
    res.json(predica);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la prédica" });
  }
});

// post nueva o varias predicas
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    let predicas = [];

    if (Array.isArray(data)) {
      // valida que todos tengan title y link
      for (const p of data) {
        if (!p.title || !p.link) {
          return res.status(400).json({ error: "Faltan campos en alguna prédica" });
        }
      }
      predicas = await Predica.insertMany(data); // guarda todas de golpe
    } else {
      const { title, link } = data;
      if (!title || !link) return res.status(400).json({ error: "Faltan campos" });
      const nuevaPredica = new Predica({ title, link });
      predicas.push(await nuevaPredica.save());
    }

    res.status(201).json(predicas);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar las prédicas", details: err.message });
  }
});

export default router;