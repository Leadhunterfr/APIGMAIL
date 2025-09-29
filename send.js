import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Autoriser CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { to, subject, content } = req.body;

    if (!to || !subject || !content) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    // Transporter Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // ton mot de passe d'application
      },
    });

    // Envoi du mail
    const info = await transporter.sendMail({
      from: `"ToolShare" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text: content,
    });

    res.status(200).json({ success: true, id: info.messageId });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}
