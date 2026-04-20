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
    // IMPORTANT: No history is fetched or sent to Groq
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful and concise AI assistant." },
        { role: "user", content: question }
      ],
    });

    const answer = response.choices[0].message.content;

    // Save the interaction to MongoDB
    const newInteraction = await Interaction.create({ question, answer });

    res.json({ answer, id: newInteraction._id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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