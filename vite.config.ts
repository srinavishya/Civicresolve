import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'http';

// Backend middleware for secure Google Gemini AI analysis during development
function geminiBackendPlugin() {
  return {
    name: 'gemini-backend',
    configureServer(server: any) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        if (req.url === '/api/analyze-complaint' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });

          req.on('end', async () => {
            try {
              const { title, description } = JSON.parse(body || '{}');

              if (!description || typeof description !== 'string') {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Description is required for AI analysis' }));
                return;
              }

              const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

              if (!apiKey) {
                // Return clear error without faking AI success
                res.statusCode = 503;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  error: 'Gemini API key is not configured on the server. Please provide manual category and priority, or configure GEMINI_API_KEY.',
                  code: 'NO_API_KEY'
                }));
                return;
              }

              // Call Gemini API securely from backend
              const prompt = `You are an AI civic assistant for CivicResolve.
Analyze the following civic complaint details submitted by a citizen in English, Tamil, or Hindi.

Complaint Title: ${title || 'N/A'}
Complaint Description: ${description}

Analyze the problem and respond ONLY with a valid JSON object matching this schema:
{
  "category": "Pothole" | "Garbage" | "Streetlights" | "Water Leakage" | "Road Damage" | "Other",
  "priority": "Critical" | "High" | "Medium" | "Low",
  "department": "Roads & Highways" | "Solid Waste" | "Electricity Board" | "Water Supply" | "Public Works",
  "explanation": "Clear, concise reason explaining the category, urgency and risk",
  "publicSafetyConcerns": "Specific safety risks e.g. vehicle damage, pedestrian danger, disease, electrocution"
}

Guideline for Priority:
- "Critical": Deep potholes near schools/busy roads, open manholes, dangling live electrical wires, heavy water pipe burst flooding road, major cave-ins.
- "High": Non-working streetlights in dark high-crime or pedestrian corridors, leaking pipes, uncollected garbage blocking roads.
- "Medium": Standard garbage accumulation, small potholes on slow residential streets, cracked sidewalks.
- "Low": Minor cosmetic road surface cracking, faded road paint.

Output ONLY valid raw JSON with no markdown backticks or extra text.`;

              const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
              
              const geminiRes = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [
                    {
                      parts: [{ text: prompt }]
                    }
                  ],
                  generationConfig: {
                    temperature: 0.2,
                    responseMimeType: 'application/json'
                  }
                })
              });

              if (!geminiRes.ok) {
                const errData = await geminiRes.text();
                res.statusCode = 502;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  error: 'Gemini API call failed',
                  details: errData
                }));
                return;
              }

              const data = await geminiRes.json();
              const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

              if (!textContent) {
                throw new Error('Empty response from Gemini');
              }

              // Parse and validate structured output
              const cleaned = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleaned);

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                category: parsed.category || 'Other',
                priority: parsed.priority || 'Medium',
                department: parsed.department || 'Public Works',
                explanation: parsed.explanation || 'Processed by civic AI assistant.',
                publicSafetyConcerns: parsed.publicSafetyConcerns || 'None reported'
              }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                error: 'AI analysis encountered an error: ' + (err.message || 'Unknown error'),
                code: 'ANALYSIS_ERROR'
              }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), geminiBackendPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
