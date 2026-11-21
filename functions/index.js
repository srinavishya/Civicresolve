const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * HTTPS Cloud Function: analyzeComplaint
 * Analyzes civic issue descriptions with Google Gemini securely on the backend.
 * Protects the GEMINI_API_KEY from exposure in the frontend.
 */
exports.analyzeComplaint = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { title, description } = req.body;

    if (!description || typeof description !== "string") {
      return res.status(400).json({ error: "Description is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: "Gemini API key is not configured on the server.",
        code: "NO_API_KEY"
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    });

    const prompt = `You are an AI civic assistant for CivicResolve.
Analyze the following civic complaint details submitted by a citizen in English, Tamil, or Hindi:

Complaint Title: ${title || "N/A"}
Complaint Description: ${description}

Analyze the problem and respond ONLY with a valid JSON object matching this schema:
{
  "category": "Potholes" | "Garbage" | "Streetlights" | "Water Leakage" | "Road Damage" | "Other",
  "priority": "Critical" | "High" | "Medium" | "Low",
  "department": "Roads & Highways" | "Solid Waste" | "Electricity Board" | "Water Supply" | "Public Works",
  "explanation": "Clear, concise reason explaining the category, urgency and risk",
  "publicSafetyConcerns": "Specific safety risks e.g. vehicle damage, pedestrian danger, disease, electrocution"
}

Output ONLY valid raw JSON with no markdown backticks or commentary.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, "").trim());

    return res.status(200).json({
      category: parsed.category || "Other",
      priority: parsed.priority || "Medium",
      department: parsed.department || "Public Works",
      explanation: parsed.explanation || "Analyzed by civic AI assistant.",
      publicSafetyConcerns: parsed.publicSafetyConcerns || "None identified"
    });
  } catch (err) {
    console.error("Gemini analysis error:", err);
    return res.status(500).json({
      error: "AI analysis encountered an error: " + (err.message || "Unknown error"),
      code: "ANALYSIS_ERROR"
    });
  }
});
