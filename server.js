import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // si usas Node <18

const app = express();
app.use(bodyParser.json());

// Endpoint del chat
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    // Aquí deberías conectar con tu IA (Copilot/Azure OpenAI)
    // Por ahora devolvemos un mensaje de prueba
    res.json({ reply: `Recibí tu mensaje: "${userMessage}"` });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});