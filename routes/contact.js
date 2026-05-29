import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  const { nombre, email, telefono, necesidad } = req.body;

  if (!nombre || !email || !telefono || !necesidad) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  res.status(200).json({ message: "Mensaje enviado correctamente" });
});

export default router;
