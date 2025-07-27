# Reclaimtool1

A field inspection tool for property and roofing assessments, using AI for image analysis.

## Features

- Field inspection checklists for roof, exterior, and documentation.
- Camera integration for photo capture.
- AI-powered photo analysis (OpenAI Vision, GPT-4o-mini).
- Measurement tools and note taking.

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- OpenAI API Key (for AI features)

### Setup

```bash
git clone https://github.com/dustinstormnation/Reclaimtool1.git
cd Reclaimtool1
npm install
```

Create a `.env.local` file with:

```
OPENAI_API_KEY=your-openai-key-here
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy easily to [Vercel](https://vercel.com/) or similar. Set environment variable `OPENAI_API_KEY` in your hosting dashboard.

## Folder Structure

- `components/InspectionTool.jsx`: Main UI logic.
- `pages/api/assess.js`: API route for AI assessment.
- `pages/index.js`: Main entry point.

## Roadmap / TODO

- Real image uploading/saving
- Better error UX
- Unit and integration tests

## License

MIT
