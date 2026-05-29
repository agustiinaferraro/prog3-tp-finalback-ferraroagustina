import { Router } from "express";
import nodemailer from "nodemailer";

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

  transporter.sendMail({
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
  }).catch(() => {});

  res.status(200).json({ message: "Mensaje enviado correctamente" });
});

export default router;
