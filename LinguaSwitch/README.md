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

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js** | LTS recommended (e.g. 20.x or newer). Includes `npm`. See [nodejs.org](https://nodejs.org/). |
| **Python** | **3.11+** (matches `apps/api/pyproject.toml`). |
| **Browser** | **Chrome** or another Chromium-based browser for reliable Web Speech API support. |

Optional: this repo includes a **`.nvmrc`** (Node 24) if you use [nvm](https://github.com/nvm-sh/nvm), [fnm](https://github.com/Schniz/fnm), or nvm-windows.

## How to run the app

You need **two terminals**: one for the API, one for the web app. Start the **backend first**, then the **frontend**.

### 1. Start the backend (FastAPI)

From the **repository root** (the folder that contains `apps/`):

**macOS / Linux**

```bash
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn bilingual_bot.main:app --reload --host 127.0.0.1 --port 8000
```

**Windows (PowerShell)**

```powershell
cd apps\api
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
python -m uvicorn bilingual_bot.main:app --reload --host 127.0.0.1 --port 8000
```

The API should respond at [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health) with `{"status":"ok"}`.

### 2. Start the frontend (Next.js)

Open a **second** terminal, from the **same repository root**:

```bash
npm install
npm run dev:web
```

### 3. Open the app

In your browser, go to **[http://localhost:3000](http://localhost:3000)**.

Complete **onboarding** first, then use **Session** for voice chat. The UI calls the API at **`http://localhost:8000`** by default.

### Optional: API base URL

If the API runs on another host or port, set this before `npm run dev:web`:

```bash
# macOS / Linux
export NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

# Windows PowerShell
$env:NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:8000"
```

Copy the repo root `.env.example` to **`apps/web/.env.local`** and adjust `NEXT_PUBLIC_API_BASE_URL` if needed (Next.js loads env files from the `web` app directory when you run `dev:web`).

## Troubleshooting

- **`npm` not found** — Install Node.js and **open a new terminal** (or restart your IDE) so `PATH` includes Node. On Windows, Node is usually under `C:\Program Files\nodejs\`.
- **Frontend cannot reach API** — Confirm the backend is running and port **8000** is free. Check the browser network tab for failed requests to `/api/v1/...`.
- **Microphone or speech not working** — Use **HTTPS** or **localhost**; grant mic permission; prefer **Chrome**.
- **`Activate.ps1` execution policy** (Windows) — If activation fails, run PowerShell as Administrator once:  
  `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## Contributors

- Sammy Suliman
- Heesung Yun

## Notes

- The MVP uses browser-native voice APIs, so best results are in Chrome-based browsers.
- Backend state is **in memory** for speed. Restarting the API clears profiles and sessions.
- The response engine is a Stage 1 orchestration layer, not a trained bilingual model.
