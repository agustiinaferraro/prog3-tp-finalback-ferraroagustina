import { Router } from "express";
<<<<<<< HEAD
import Contact from "../models/Contact.js";
=======
import nodemailer from "nodemailer";
>>>>>>> 7f4e30f9afa0ae9a920f62d087d23f0303cba972

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
<<<<<<< HEAD
    await Contact.create({ nombre, email, telefono, necesidad });
=======
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

>>>>>>> 7f4e30f9afa0ae9a920f62d087d23f0303cba972
    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el mensaje" });
  }
});

export default router;
