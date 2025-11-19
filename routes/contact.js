import { Router } from "express";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = Router();

router.post("/", async (req, res) => {
  const { nombre, email, telefono, necesidad } = req.body;

  if (!nombre || !email || !telefono || !necesidad) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    await sgMail.send({
      to: process.env.EMAIL_USER,
      from: process.env.EMAIL_USER,
      subject: `Nuevo mensaje de ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nNecesidad: ${necesidad}`,
    });

    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el mensaje", error });
  }
});

export default router;