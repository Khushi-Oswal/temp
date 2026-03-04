# BioClock - Predictive Health Dashboard

AI-powered predictive health monitoring system for the Indian population using Amazon Bedrock Nova.

## Features

✅ Patient data input form with 10+ biomarkers (US-1)
✅ Patient dashboard with risk-level visualization (US-2)
✅ AI analysis trigger with agent progress (US-3)
✅ Agent reasoning panel with expandable sections (US-4)
✅ Biomarker trend charts (US-5)
✅ Disease prediction timeline (US-6)
✅ Multilingual translation (US-7)

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Recharts
- React Router
- Axios

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## API Configuration

Base URL: `https://in69ou4s98.execute-api.ap-south-1.amazonaws.com/Dev`

Endpoints configured in `src/utils/api.js`

## Pages

- `/` - Landing page
- `/dashboard` - Patient list with risk overview
- `/patient/:id` - Patient detail with biomarkers and trends
- `/analyze/:id` - AI analysis results with agent reasoning
- `/input` - New patient data entry form

## Deployment

Deploy to AWS Amplify:
1. Connect GitHub repository
2. Build command: `npm run build`
3. Output directory: `dist`
