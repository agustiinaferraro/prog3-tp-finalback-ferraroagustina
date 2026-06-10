import { Router } from "express";
import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

const router = Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/", async (req, res) => {
  const { nombre, email, telefono, necesidad } = req.body;

  if (!nombre || !email || !telefono || !necesidad) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    await Contact.create({ nombre, email, telefono, necesidad });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Nuevo mensaje de ${nombre}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${telefono}</p>
          <p><strong>Necesidad:</strong></p>
          <p>${necesidad}</p>
        `,
      });
    } catch (emailErr) {
      console.error("Error al enviar email:", emailErr);
    }

    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener mensajes" });
  }
});

export default router;
