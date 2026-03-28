# LinguaSwitch Stage 1

LinguaSwitch is a Stage 1 bilingual voice-chat MVP for gradual second-language learning.

This version includes:

- a Next.js frontend with onboarding, live session, and progress views
- browser microphone speech recognition
- browser text-to-speech playback
- a FastAPI backend with learner profiles, sessions, ratio control, and bilingual response generation
- no custom model training yet

## Stack

- Frontend: Next.js 15, React 19, TypeScript
- Backend: FastAPI, Pydantic
- Voice input: browser SpeechRecognition API
- Voice output: browser speechSynthesis API

## Run

### 1. Start the backend

```bash
cd /Users/heesung/Desktop/LinguaSwitch/apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn bilingual_bot.main:app --reload --port 8000
```

### 2. Start the frontend

```bash
cd /Users/heesung/Desktop/LinguaSwitch
npm install
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- The MVP uses browser-native voice APIs, so best results are in Chrome-based browsers.
- Backend state is in memory for speed. Restarting the API clears profiles and sessions.
- The response engine is a Stage 1 orchestration layer, not a trained bilingual model.

