import { Router } from "express";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = Router();

router.post("/", async (req, res) => {
  const { nombre, email, telefono, necesidad } = req.body;

  if (!nombre || !email || !telefono || !necesidad) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  sgMail.send({
    to: process.env.EMAIL_USER,
    from: process.env.EMAIL_USER,
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
