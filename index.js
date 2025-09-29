import express from "express";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

// Route principale pour envoyer un mail
app.post("/send", async (req, res) => {
  const { to, subject, content } = req.body;

  if (!to || !subject || !content) {
    return res.status(400).json({ error: "Missing fields: to, subject, content" });
  }

  // Config transporteur Gmail
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,  // ton Gmail (variable Vercel)
      pass: process.env.MAIL_PASS   // mot de passe d’application (variable Vercel)
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"Base44 App" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html: content
    });

    res.json({ success: true, id: info.messageId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export obligatoire pour Vercel
export default app;
