import { Configuration, OpenAIApi } from 'openai'

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(config)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }
  const { imageBase64, itemId } = req.body
  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing imageBase64 in body' })
  }
  try {
    // Use GPT-4o-mini for demonstration; replace with Vision API if available
    const gptResp = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You’re an expert roofing inspector.' },
        { role: 'user', content: `Analyze this damage (Base64 image): ${imageBase64}` }
      ]
    })
    // Respond as object for frontend compatibility
    res.status(200).json({ findings: { [itemId]: gptResp.data.choices[0].message.content } })
  } catch (err) {
    console.error('OpenAI error:', err)
    res.status(500).json({ error: 'AI assessment failed' })
  }
}
