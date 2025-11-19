import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const { nombre, email, telefono, necesidad } = req.body;

    if (!nombre || !email || !telefono || !necesidad) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const msg = {
      to: "iglesiacasadelalfareromunro@gmail.com", // tu correo
      from: "LaCasaDelAlfareroMunro <iglesiacasadelalfareromunro@gmail.com>", // nombre y correo del remitente
      subject: `Nuevo mensaje de ${nombre}`,
      text: `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nNecesidad: ${necesidad}`,
    };

    await sgMail.send(msg);

    return res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al enviar el mensaje", error: err });
  }
}