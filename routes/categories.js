import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

//obtener todas las categorias
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al obtener las categorías", error });
  }
});

//crear nueva categoria
router.post("/", async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const nuevaCategory = new Category({ name, slug });
    await nuevaCategory.save();

    res.status(201).json({ message: "Categoría creada", category: nuevaCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear la categoría", error });
  }
});

export default router;
