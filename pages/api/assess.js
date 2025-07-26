import { Configuration, OpenAIApi } from 'openai'
const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
const openai = new OpenAIApi(config)

export default async function handler(req, res) {
  const { imageBase64, itemId } = req.body
  // call your AI model here…
  const gptResp = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You’re an expert roofing inspector.' },
      { role: 'user', content: `Analyze this damage: ${imageBase64}` }
    ]
  })
  res.status(200).json({ findings: gptResp.data.choices[0].message.content })
}
