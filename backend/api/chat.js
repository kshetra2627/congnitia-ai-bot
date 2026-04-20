export default function handler(req, res) {
  if (req.method === "POST") {
    const { question } = req.body;

    return res.status(200).json({
      answer: "Working backend: " + question
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
}