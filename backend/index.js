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

// Schema - Stores single User question and AI response pair
const InteractionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Interaction = mongoose.model("Interaction", InteractionSchema);

// Groq setup
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Cognitia AI Backend is running" });
});

// Route: Single Question -> Single Response
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question required" });
  }

  try {
    let answer = "";

    // Try to get answer from Groq
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful and concise AI assistant." },
          { role: "user", content: question }
        ],
      });
      answer = response.choices[0].message.content;
    } catch (groqErr) {
      console.error("Groq error:", groqErr);
      // Fallback: provide a simple response if Groq fails
      answer = `I received your question: "${question}". The AI service is temporarily unavailable, but your question has been logged.`;
    }

    // Try to save to MongoDB (but don't fail if it doesn't work)
    try {
      await Interaction.create({ question, answer });
    } catch (dbErr) {
      console.error("MongoDB error:", dbErr);
      // Continue anyway - user still gets response
    }

    res.json({ answer, id: "temp-" + Date.now() });

  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Route to get history for the UI (Optional, but useful for viewing past work)
app.get("/history", async (req, res) => {
  try {
    const history = await Interaction.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// Route to clear history
app.delete("/history", async (req, res) => {
  try {
    await Interaction.deleteMany({});
    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});