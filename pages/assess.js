// pages/api/assess.js
import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

export default async function handler(req, res) {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'Missing imageUrl in body' });
    }

    // Call the Vision endpoint
    const aiResp = await openai.createVisionAnalysis({
      model: 'vision-alpha',
      image: imageUrl,
    });

    // Simplify the findings for UI
    const findings = aiResp.data.findings.map(f => ({
      label: f.label,
      confidence: f.confidence,
      location: f.boundingBox,
    }));

    return res.status(200).json({ findings });
  } catch (err) {
    console.error('OpenAI error:', err);
    return res.status(500).json({ error: 'AI assessment failed' });
  }
}
