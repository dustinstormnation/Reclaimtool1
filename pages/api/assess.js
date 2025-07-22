import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export default async function handler(req, res) {
  const { imageUrl } = req.body;
  // Call OpenAI Vision endpoint
  const response = await openai.createImageAnalysis({
    model: 'vision-alpha',
    image: imageUrl,
  });
  // Extract damage findings & return
  res.status(200).json({ findings: response.data });
}
