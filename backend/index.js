import express from "express";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema
const QA = mongoose.model("QA", new mongoose.Schema({
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
}));

// Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Route
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question required" });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: question }],
    });

    const answer = response.choices[0].message.content;

    await QA.create({ question, answer });

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});