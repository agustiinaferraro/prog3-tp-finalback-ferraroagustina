import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    //configuracion del transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // contenido del mail
    const mailOptions = {
      from: process.env.EMAIL_USER, // de quien llega
      to: "iglesiacasadelalfareromunro@gmail.com",   // mi mail
      subject: `Nuevo mensaje de ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\nMensaje: ${message}`,
    };

    // enviar mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al enviar el mensaje", error });
  }
});

export default router;