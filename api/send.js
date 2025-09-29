import nodemailer from "nodemailer";

export default async function handler(req, res) {
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

    console.log("🚀 Tentative d'envoi d'email...");
    console.log("📧 User:", process.env.GMAIL_USER ? "OK" : "MISSING");
    console.log("🔑 Pass:", process.env.GMAIL_PASS ? "OK" : "MISSING");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true pour le port 465
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });


    const info = await transporter.sendMail({
      from: `"ToolShare" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text: content,
    });

    console.log("✅ Email envoyé :", info.messageId);
    res.status(200).json({ success: true, id: info.messageId });
  } catch (err) {
    console.error("❌ Erreur SMTP :", err);
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
}
