# Bilingual Code-Switching Chatbot Architecture

## Product Goal

Build a voice-first chatbot that helps a learner acquire a second language through gradual code switching.

The core behavior is:

- the learner starts with almost all dialogue in their native language
- the assistant introduces a very small amount of the target language
- the target-language ratio increases over time based on learner progress
- the user can speak into their microphone and hear the assistant speak back
- the system remembers vocabulary, comprehension level, mistakes, and confidence
- the long-term model is trained or adapted on bilingual code-switching dialogue data

This document describes a full-stack architecture for that app and a proposed repository structure with a detailed description of what each file does.

---

## Recommended Technical Approach

Use a staged architecture rather than trying to train everything from scratch immediately.

### Stage 1: Ship a working product fast

- web frontend for microphone, transcript, and progress UI
- backend conversation orchestrator
- speech-to-text
- a strong base LLM for dialogue generation
- text-to-speech
- a code-switch controller that explicitly sets the target language ratio
- learner memory and session analytics

This gives you a demoable product quickly.

### Stage 2: Add model specialization

- collect anonymized dialogue traces
- build a bilingual code-switching dataset
- train adapters or fine-tune a dialogue model
- optionally train a separate policy model that decides when and how to switch languages

This improves naturalness, pedagogical quality, and consistency.

---

## High-Level System Flow

1. The user opens the web app and selects native language, target language, and current level.
2. The browser captures microphone audio and streams it to the backend.
3. The backend speech service transcribes the utterance.
4. Language analysis detects which parts are native language, target language, and mixed speech.
5. The learner-state service updates mastery estimates, recent errors, and current code-switch ratio.
6. The conversation orchestrator builds a prompt using:
   - current lesson context
   - learner profile
   - memory from prior sessions
   - code-switch policy
   - safety and teaching constraints
7. The dialogue model generates a bilingual response that follows the target ratio.
8. The response is checked by a code-switch validator.
9. The text response is converted to speech.
10. The frontend plays audio, displays the transcript, and highlights target-language phrases for learning.
11. Session events are stored for analytics, personalization, and future training.

---

## Core Product Capabilities

### 1. Voice Conversation

- microphone capture in the browser
- low-latency audio streaming
- live partial transcription
- synthesized assistant speech playback

### 2. Gradual Code Switching

- configurable ratio such as `99:1`, `90:10`, `80:20`
- ratio adjusted by user level, lesson plan, or performance
- phrase-level or sentence-level code switching

### 3. Personalized Learning

- track known vocabulary
- detect recurring mistakes
- store difficult grammar patterns
- adapt pace and switching aggressiveness

### 4. Learning UX

- show translations on demand, not by default
- highlight new words
- allow replay of assistant audio
- support corrections and short explanations

### 5. Model Improvement Loop

- log user interactions
- build supervised fine-tuning examples
- evaluate pedagogical quality and natural code switching

---

## Proposed Repository Layout

```text
.
├── README.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── pyproject.toml
├── package.json
├── pnpm-workspace.yaml
├── .env.example
├── .gitignore
├── apps/
│   ├── web/
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   ├── public/
│   │   │   ├── icons/
│   │   │   └── audio-worklets/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx
│   │       │   ├── page.tsx
│   │       │   ├── session/page.tsx
│   │       │   ├── onboarding/page.tsx
│   │       │   ├── progress/page.tsx
│   │       │   └── api/health/route.ts
│   │       ├── components/
│   │       │   ├── chat-panel.tsx
│   │       │   ├── transcript-view.tsx
│   │       │   ├── microphone-button.tsx
│   │       │   ├── ratio-meter.tsx
│   │       │   ├── vocabulary-card.tsx
│   │       │   ├── playback-controls.tsx
│   │       │   └── session-summary.tsx
│   │       ├── hooks/
│   │       │   ├── use-audio-recorder.ts
│   │       │   ├── use-realtime-session.ts
│   │       │   ├── use-tts-player.ts
│   │       │   └── use-learner-settings.ts
│   │       ├── lib/
│   │       │   ├── api-client.ts
│   │       │   ├── websocket-client.ts
│   │       │   ├── audio-utils.ts
│   │       │   └── formatters.ts
│   │       ├── styles/
│   │       │   └── globals.css
│   │       └── types/
│   │           └── index.ts
│   ├── api/
│   │   ├── pyproject.toml
│   │   ├── alembic.ini
│   │   ├── migrations/
│   │   │   └── versions/
│   │   └── src/
│   │       └── bilingual_bot/
│   │           ├── main.py
│   │           ├── config.py
│   │           ├── dependencies.py
│   │           ├── api/
│   │           │   ├── routes_health.py
│   │           │   ├── routes_auth.py
│   │           │   ├── routes_sessions.py
│   │           │   ├── routes_profile.py
│   │           │   ├── routes_progress.py
│   │           │   └── routes_admin.py
│   │           ├── realtime/
│   │           │   ├── websocket_manager.py
│   │           │   ├── audio_ingest.py
│   │           │   ├── stream_protocol.py
│   │           │   └── turn_detector.py
│   │           ├── orchestration/
│   │           │   ├── session_orchestrator.py
│   │           │   ├── dialogue_manager.py
│   │           │   ├── prompt_builder.py
│   │           │   ├── response_validator.py
│   │           │   └── fallback_manager.py
│   │           ├── speech/
│   │           │   ├── stt_service.py
│   │           │   ├── tts_service.py
│   │           │   ├── pronunciation_scorer.py
│   │           │   └── voice_selector.py
│   │           ├── pedagogy/
│   │           │   ├── ratio_policy.py
│   │           │   ├── curriculum_engine.py
│   │           │   ├── learner_state.py
│   │           │   ├── correction_engine.py
│   │           │   └── lesson_planner.py
│   │           ├── language/
│   │           │   ├── language_identifier.py
│   │           │   ├── code_switch_detector.py
│   │           │   ├── grammar_tagging.py
│   │           │   ├── translation_support.py
│   │           │   └── vocabulary_extractor.py
│   │           ├── llm/
│   │           │   ├── client.py
│   │           │   ├── prompts.py
│   │           │   ├── structured_outputs.py
│   │           │   └── safety_filters.py
│   │           ├── memory/
│   │           │   ├── session_memory.py
│   │           │   ├── long_term_memory.py
│   │           │   ├── retrieval.py
│   │           │   └── summarizer.py
│   │           ├── db/
│   │           │   ├── base.py
│   │           │   ├── models.py
│   │           │   ├── repositories.py
│   │           │   └── session.py
│   │           ├── schemas/
│   │           │   ├── auth.py
│   │           │   ├── session.py
│   │           │   ├── learner.py
│   │           │   ├── progress.py
│   │           │   └── admin.py
│   │           ├── workers/
│   │           │   ├── tasks.py
│   │           │   ├── analytics_jobs.py
│   │           │   └── training_export_jobs.py
│   │           └── utils/
│   │               ├── logging.py
│   │               ├── metrics.py
│   │               ├── ids.py
│   │               └── time.py
├── model/
│   ├── README.md
│   ├── configs/
│   │   ├── data.yaml
│   │   ├── training.yaml
│   │   ├── eval.yaml
│   │   └── augmentation.yaml
│   ├── datasets/
│   │   ├── raw/
│   │   ├── interim/
│   │   ├── processed/
│   │   └── manifests/
│   ├── notebooks/
│   │   ├── dataset_audit.ipynb
│   │   ├── code_switch_stats.ipynb
│   │   └── error_analysis.ipynb
│   ├── src/
│   │   └── bilingual_model/
│   │       ├── data/
│   │       │   ├── download_sources.py
│   │       │   ├── normalize_corpus.py
│   │       │   ├── align_turns.py
│   │       │   ├── build_examples.py
│   │       │   ├── split_dataset.py
│   │       │   └── quality_filters.py
│   │       ├── features/
│   │       │   ├── ratio_features.py
│   │       │   ├── learner_features.py
│   │       │   └── token_labeling.py
│   │       ├── training/
│   │       │   ├── sft_train.py
│   │       │   ├── dpo_train.py
│   │       │   ├── lora_finetune.py
│   │       │   ├── checkpoints.py
│   │       │   └── registry.py
│   │       ├── eval/
│   │       │   ├── run_eval.py
│   │       │   ├── code_switch_metrics.py
│   │       │   ├── pedagogy_metrics.py
│   │       │   ├── fluency_metrics.py
│   │       │   └── human_eval_export.py
│   │       ├── inference/
│   │       │   ├── serve.py
│   │       │   ├── router.py
│   │       │   └── adapters.py
│   │       └── utils/
│   │           ├── io.py
│   │           ├── seeds.py
│   │           └── logging.py
├── infra/
│   ├── docker/
│   │   ├── web.Dockerfile
│   │   ├── api.Dockerfile
│   │   └── model.Dockerfile
│   ├── compose.yaml
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana-dashboard.json
└── tests/
    ├── web/
    │   ├── microphone-button.test.tsx
    │   └── ratio-meter.test.tsx
    ├── api/
    │   ├── test_sessions.py
    │   ├── test_ratio_policy.py
    │   ├── test_code_switch_detector.py
    │   └── test_prompt_builder.py
    └── model/
        ├── test_build_examples.py
        ├── test_code_switch_metrics.py
        └── test_quality_filters.py
```

---

## Frontend Architecture

The frontend should be a web app because it gives easy access to microphone permissions, works cross-platform, and is fast to demo.

### Frontend Responsibilities

- capture microphone input
- stream audio to backend
- show live transcript
- play assistant audio
- display code-switch ratio and progress
- surface vocabulary and corrections
- manage onboarding and learner settings

### Frontend Files

#### `apps/web/package.json`

Defines frontend dependencies such as Next.js, React, audio helpers, UI libraries, and testing tools.

#### `apps/web/next.config.ts`

Configures the Next.js app, environment exposure, image settings, and any proxy behavior for the API.

#### `apps/web/tsconfig.json`

Defines TypeScript compiler rules, path aliases, and strictness settings for the frontend.

#### `apps/web/public/icons/`

Stores static icons used by the UI, such as microphone, replay, translation, and progress indicators.

#### `apps/web/public/audio-worklets/`

Contains browser audio-processing scripts for low-latency microphone capture, chunking, and possible volume normalization.

#### `apps/web/src/app/layout.tsx`

Defines the top-level page shell, metadata, fonts, and global providers.

#### `apps/web/src/app/page.tsx`

Landing page that explains the product and routes the user into onboarding or an active session.

#### `apps/web/src/app/session/page.tsx`

Main conversation screen where the user speaks, sees transcript updates, hears the assistant, and gets learning feedback.

#### `apps/web/src/app/onboarding/page.tsx`

Collects native language, target language, current proficiency, goals, and preferred pacing.

#### `apps/web/src/app/progress/page.tsx`

Shows learner analytics, vocabulary growth, recent mistakes, and code-switch progression over time.

#### `apps/web/src/app/api/health/route.ts`

Simple frontend-side health route for uptime checks or deployment verification.

#### `apps/web/src/components/chat-panel.tsx`

Top-level conversation component that combines transcript, audio controls, ratio indicator, and assistant responses.

#### `apps/web/src/components/transcript-view.tsx`

Renders the live transcript with token highlighting, language color coding, and optional translations.

#### `apps/web/src/components/microphone-button.tsx`

Controls microphone start, stop, permission state, and active-recording visuals.

#### `apps/web/src/components/ratio-meter.tsx`

Displays the current native-language versus target-language balance for the session.

#### `apps/web/src/components/vocabulary-card.tsx`

Shows newly introduced words, meaning, pronunciation, and example usage from the conversation.

#### `apps/web/src/components/playback-controls.tsx`

Lets the user replay assistant speech, slow it down, or repeat just the target-language segments.

#### `apps/web/src/components/session-summary.tsx`

Displays end-of-session feedback, new vocabulary, improvement tips, and recommended next ratio.

#### `apps/web/src/hooks/use-audio-recorder.ts`

Handles browser microphone APIs, buffering, chunk creation, and cleanup of audio resources.

#### `apps/web/src/hooks/use-realtime-session.ts`

Manages websocket connection state, sending audio chunks, and receiving transcripts, responses, and events.

#### `apps/web/src/hooks/use-tts-player.ts`

Queues and plays assistant audio responses while synchronizing playback status with UI.

#### `apps/web/src/hooks/use-learner-settings.ts`

Stores learner preferences locally and syncs them to the backend profile.

#### `apps/web/src/lib/api-client.ts`

Typed wrapper for REST calls to sessions, progress, profile, and admin endpoints.

#### `apps/web/src/lib/websocket-client.ts`

Encapsulates websocket protocol details, reconnect behavior, and event parsing.

#### `apps/web/src/lib/audio-utils.ts`

Provides browser-side audio transformations such as sample-rate conversion or PCM packing.

#### `apps/web/src/lib/formatters.ts`

Formats transcripts, durations, percentages, and vocabulary metadata for display.

#### `apps/web/src/styles/globals.css`

Defines design tokens, typography, layout system, and responsive styles.

#### `apps/web/src/types/index.ts`

Shared frontend type definitions for transcripts, responses, ratios, settings, and session events.

---

## Backend API and Realtime Architecture

The backend should separate normal REST APIs from the realtime voice loop.

### Backend Responsibilities

- authenticate users
- manage profiles and progress
- receive streaming audio
- run turn detection
- call speech models and dialogue models
- enforce code-switch policy
- store memory and analytics
- export data for training

### Backend Files

#### `apps/api/pyproject.toml`

Defines Python dependencies for FastAPI, websockets, ORM, task queue, speech tooling, and testing.

#### `apps/api/alembic.ini`

Configures database migrations.

#### `apps/api/migrations/versions/`

Contains database schema migration files.

#### `apps/api/src/bilingual_bot/main.py`

Application entry point that builds the FastAPI app, middleware, routers, and startup hooks.

#### `apps/api/src/bilingual_bot/config.py`

Loads environment variables and central runtime configuration such as model providers, database URLs, and feature flags.

#### `apps/api/src/bilingual_bot/dependencies.py`

Provides dependency injection for database sessions, auth, services, and settings.

### API Routes

#### `apps/api/src/bilingual_bot/api/routes_health.py`

Health and readiness endpoints for infrastructure and deployment checks.

#### `apps/api/src/bilingual_bot/api/routes_auth.py`

Authentication endpoints for login, signup, token refresh, and session verification.

#### `apps/api/src/bilingual_bot/api/routes_sessions.py`

Creates sessions, ends sessions, lists session history, and returns summaries.

#### `apps/api/src/bilingual_bot/api/routes_profile.py`

Stores learner language preferences, goals, pacing, and accessibility settings.

#### `apps/api/src/bilingual_bot/api/routes_progress.py`

Returns learning metrics such as vocabulary mastery, recent corrections, and recommended next ratio.

#### `apps/api/src/bilingual_bot/api/routes_admin.py`

Internal endpoints for dataset export, experiment toggles, and model-management tasks.

### Realtime Voice Loop

#### `apps/api/src/bilingual_bot/realtime/websocket_manager.py`

Owns websocket lifecycle, client registration, message routing, and cleanup.

#### `apps/api/src/bilingual_bot/realtime/audio_ingest.py`

Accepts audio chunks from the client and normalizes them into the backend streaming format.

#### `apps/api/src/bilingual_bot/realtime/stream_protocol.py`

Defines message contracts for audio frames, partial transcripts, final responses, TTS chunks, and control events.

#### `apps/api/src/bilingual_bot/realtime/turn_detector.py`

Decides when the user has finished speaking so the system can trigger assistant response generation.

---

## Conversation Orchestration Layer

This is the most important application layer. It controls teaching behavior rather than leaving everything to the model.

### Why this layer matters

A generic LLM may ignore target language ratios or switch in unnatural ways. The orchestration layer gives explicit control over:

- how much target language appears
- what kind of words appear
- whether new material matches learner level
- when to correct the learner
- when to keep the conversation flowing instead of over-explaining

### Orchestration Files

#### `apps/api/src/bilingual_bot/orchestration/session_orchestrator.py`

Coordinates the full turn lifecycle: transcript in, learner-state update, prompt creation, model call, validation, TTS, and persistence.

#### `apps/api/src/bilingual_bot/orchestration/dialogue_manager.py`

Maintains conversation state, topic continuity, and response style across multiple turns.

#### `apps/api/src/bilingual_bot/orchestration/prompt_builder.py`

Builds the model input from learner profile, target ratio, recent memory, curriculum goals, and safety instructions.

#### `apps/api/src/bilingual_bot/orchestration/response_validator.py`

Checks whether the model response follows the required language ratio, stays at the correct level, and avoids invalid output.

#### `apps/api/src/bilingual_bot/orchestration/fallback_manager.py`

Provides backup behavior if the main model fails, ratio compliance is poor, or TTS/STT is unavailable.

---

## Speech Layer

### Speech Files

#### `apps/api/src/bilingual_bot/speech/stt_service.py`

Wraps speech-to-text inference or provider APIs and returns transcripts plus confidence and timestamps.

#### `apps/api/src/bilingual_bot/speech/tts_service.py`

Converts assistant text into spoken audio, ideally with streaming support for lower latency.

#### `apps/api/src/bilingual_bot/speech/pronunciation_scorer.py`

Optionally scores learner pronunciation for target-language words or phrases.

#### `apps/api/src/bilingual_bot/speech/voice_selector.py`

Chooses voice settings based on language pair, pace, clarity, and learner preference.

---

## Pedagogy Layer

This layer decides how the chatbot behaves as a teacher.

### Pedagogy Files

#### `apps/api/src/bilingual_bot/pedagogy/ratio_policy.py`

Computes the desired code-switch ratio for the current learner and session. It can use rules like:

- new user starts at `99:1`
- once comprehension is stable, move to `95:5`
- increase target-language exposure only if recent confusion stays below a threshold

#### `apps/api/src/bilingual_bot/pedagogy/curriculum_engine.py`

Maps learner level to vocabulary bands, grammar goals, and conversation topics.

#### `apps/api/src/bilingual_bot/pedagogy/learner_state.py`

Maintains a structured view of learner ability: known words, recent mistakes, confidence, speaking speed, and listening comprehension.

#### `apps/api/src/bilingual_bot/pedagogy/correction_engine.py`

Determines when to correct the learner explicitly, implicitly reformulate, or skip correction to preserve flow.

#### `apps/api/src/bilingual_bot/pedagogy/lesson_planner.py`

Generates short-term lesson arcs so each conversation gradually reinforces target vocabulary and grammar.

---

## Language Intelligence Layer

This layer gives the app bilingual awareness beyond plain text generation.

### Language Files

#### `apps/api/src/bilingual_bot/language/language_identifier.py`

Detects which language each utterance or token belongs to.

#### `apps/api/src/bilingual_bot/language/code_switch_detector.py`

Measures the actual amount of native-language and target-language usage in user and assistant text.

#### `apps/api/src/bilingual_bot/language/grammar_tagging.py`

Adds grammatical metadata that can support corrections, explanations, and error analysis.

#### `apps/api/src/bilingual_bot/language/translation_support.py`

Provides optional translation and gloss generation when the user requests help.

#### `apps/api/src/bilingual_bot/language/vocabulary_extractor.py`

Pulls out newly introduced target-language vocabulary and links it to spaced repetition or progress tracking.

---

## LLM Layer

This layer connects the application to a general-purpose model or a specialized bilingual model.

### LLM Files

#### `apps/api/src/bilingual_bot/llm/client.py`

Unified model interface so the app can switch between a hosted API model and a self-served fine-tuned model.

#### `apps/api/src/bilingual_bot/llm/prompts.py`

Stores prompt templates for casual dialogue, guided practice, pronunciation drills, correction mode, and summary mode.

#### `apps/api/src/bilingual_bot/llm/structured_outputs.py`

Defines schemas for model outputs such as assistant text, translation map, vocabulary list, and correction objects.

#### `apps/api/src/bilingual_bot/llm/safety_filters.py`

Applies moderation and product-specific rules for age safety, harmful content, and invalid teaching output.

---

## Memory and Personalization Layer

This layer makes the chatbot feel continuous across sessions.

### Memory Files

#### `apps/api/src/bilingual_bot/memory/session_memory.py`

Stores short-lived facts needed only within a single conversation.

#### `apps/api/src/bilingual_bot/memory/long_term_memory.py`

Stores persistent learner data such as mastered words, preferred topics, common mistakes, and progress history.

#### `apps/api/src/bilingual_bot/memory/retrieval.py`

Retrieves relevant prior context for the current turn, such as recently taught vocabulary or unfinished lesson goals.

#### `apps/api/src/bilingual_bot/memory/summarizer.py`

Condenses long sessions into reusable summaries so prompts stay compact.

---

## Database Layer

### Database Files

#### `apps/api/src/bilingual_bot/db/base.py`

Defines ORM base classes and shared database metadata.

#### `apps/api/src/bilingual_bot/db/models.py`

Defines tables such as:

- users
- learner_profiles
- conversation_sessions
- conversation_turns
- vocabulary_items
- learner_vocab_progress
- correction_events
- audio_assets
- model_runs

#### `apps/api/src/bilingual_bot/db/repositories.py`

Provides database access methods so application code does not directly manage raw queries everywhere.

#### `apps/api/src/bilingual_bot/db/session.py`

Creates and manages database sessions and transaction boundaries.

---

## Data Schemas and Background Jobs

### Schema Files

#### `apps/api/src/bilingual_bot/schemas/auth.py`

Request and response models for authentication.

#### `apps/api/src/bilingual_bot/schemas/session.py`

Data structures for live session events, transcripts, responses, and summaries.

#### `apps/api/src/bilingual_bot/schemas/learner.py`

Data models for profile, language pair, goals, and learner state.

#### `apps/api/src/bilingual_bot/schemas/progress.py`

Data models for vocabulary growth, ratio history, and learning analytics.

#### `apps/api/src/bilingual_bot/schemas/admin.py`

Internal models for dataset exports, evaluation reports, and experiment configuration.

### Worker Files

#### `apps/api/src/bilingual_bot/workers/tasks.py`

Task queue entry points for asynchronous work such as analytics, export, and long-running evaluation.

#### `apps/api/src/bilingual_bot/workers/analytics_jobs.py`

Computes progress metrics, vocabulary mastery updates, and session-level reporting in the background.

#### `apps/api/src/bilingual_bot/workers/training_export_jobs.py`

Exports cleaned conversation traces and labels for model training pipelines.

### Utility Files

#### `apps/api/src/bilingual_bot/utils/logging.py`

Central logging configuration.

#### `apps/api/src/bilingual_bot/utils/metrics.py`

Application metrics emission for latency, error rates, and model quality indicators.

#### `apps/api/src/bilingual_bot/utils/ids.py`

Helper functions for generating stable identifiers.

#### `apps/api/src/bilingual_bot/utils/time.py`

Time helpers for timestamps, duration calculations, and scheduling.

---

## Model Training Architecture

The app should not rely only on prompt engineering forever. A specialized bilingual model or adapter can improve:

- natural code switching
- stable adherence to target ratios
- level-appropriate vocabulary
- smoother corrections
- better pedagogical style

### Recommended Training Strategy

Start with a strong base multilingual model and fine-tune it rather than training a new foundation model from scratch.

Recommended sequence:

1. supervised fine-tuning on bilingual tutoring conversations
2. preference optimization on good versus bad code-switch responses
3. optional small policy model for ratio control and correction timing

### Model Files

#### `model/README.md`

Explains the training workflow, required datasets, compute assumptions, and how model artifacts are promoted into production.

### Model Configs

#### `model/configs/data.yaml`

Defines dataset sources, language pairs, split rules, and inclusion criteria.

#### `model/configs/training.yaml`

Defines optimizer settings, batch sizes, LoRA or full fine-tuning options, checkpoint frequency, and hardware assumptions.

#### `model/configs/eval.yaml`

Defines automatic evaluation benchmarks and thresholds for promoting a model.

#### `model/configs/augmentation.yaml`

Controls synthetic data generation, paraphrasing, ratio balancing, and noise injection.

### Dataset Directories

#### `model/datasets/raw/`

Stores untouched source corpora and original exports.

#### `model/datasets/interim/`

Stores partially cleaned artifacts such as aligned turns or filtered subsets.

#### `model/datasets/processed/`

Stores final training-ready examples.

#### `model/datasets/manifests/`

Stores metadata describing corpus versions, licensing, and preprocessing lineage.

### Notebook Files

#### `model/notebooks/dataset_audit.ipynb`

Used to inspect source quality, language balance, duplication, and missing labels.

#### `model/notebooks/code_switch_stats.ipynb`

Analyzes switch frequency, sentence-level ratios, and token-level language balance.

#### `model/notebooks/error_analysis.ipynb`

Used after evaluation to study failure cases and guide prompt or training changes.

### Data Pipeline Files

#### `model/src/bilingual_model/data/download_sources.py`

Downloads or ingests public bilingual and code-switching datasets plus internal exports.

#### `model/src/bilingual_model/data/normalize_corpus.py`

Converts raw corpora into a common schema across different source formats.

#### `model/src/bilingual_model/data/align_turns.py`

Aligns speaker turns, timestamps, and conversation boundaries for dialogue training.

#### `model/src/bilingual_model/data/build_examples.py`

Builds final supervised examples containing:

- system teaching instruction
- learner profile
- desired code-switch ratio
- dialogue history
- target response

#### `model/src/bilingual_model/data/split_dataset.py`

Creates train, validation, and test splits without leaking speakers or conversations across splits.

#### `model/src/bilingual_model/data/quality_filters.py`

Removes noisy examples, malformed code switching, misidentified languages, and unsafe content.

### Feature Files

#### `model/src/bilingual_model/features/ratio_features.py`

Computes numerical labels and statistics about actual language ratios in each example.

#### `model/src/bilingual_model/features/learner_features.py`

Encodes learner level, known vocabulary size, and pedagogical context as structured features.

#### `model/src/bilingual_model/features/token_labeling.py`

Adds per-token language labels for evaluation or auxiliary training objectives.

### Training Files

#### `model/src/bilingual_model/training/sft_train.py`

Runs supervised fine-tuning on teacher-style bilingual conversation data.

#### `model/src/bilingual_model/training/dpo_train.py`

Runs preference optimization using ranked outputs, for example preferring better pedagogical responses or better ratio adherence.

#### `model/src/bilingual_model/training/lora_finetune.py`

Implements parameter-efficient fine-tuning so the team can train with modest hardware.

#### `model/src/bilingual_model/training/checkpoints.py`

Handles checkpoint saving, retention, loading, and resume behavior.

#### `model/src/bilingual_model/training/registry.py`

Tracks trained model versions, metadata, and deployment readiness.

### Evaluation Files

#### `model/src/bilingual_model/eval/run_eval.py`

Main evaluation entry point that runs all automatic metrics on a candidate model.

#### `model/src/bilingual_model/eval/code_switch_metrics.py`

Measures whether generated responses match requested bilingual ratios and switch naturally.

#### `model/src/bilingual_model/eval/pedagogy_metrics.py`

Measures teaching quality such as vocabulary appropriateness, correction burden, and progression control.

#### `model/src/bilingual_model/eval/fluency_metrics.py`

Measures naturalness, coherence, and grammatical quality across both languages.

#### `model/src/bilingual_model/eval/human_eval_export.py`

Packages samples for bilingual human reviewers to score helpfulness and educational quality.

### Inference Files

#### `model/src/bilingual_model/inference/serve.py`

Serves the fine-tuned model behind an internal API if you self-host inference.

#### `model/src/bilingual_model/inference/router.py`

Chooses which model or adapter to use for a given language pair or learner level.

#### `model/src/bilingual_model/inference/adapters.py`

Loads LoRA adapters or other specialized components at inference time.

### Model Utilities

#### `model/src/bilingual_model/utils/io.py`

Shared file loading and serialization helpers.

#### `model/src/bilingual_model/utils/seeds.py`

Ensures reproducible experiments.

#### `model/src/bilingual_model/utils/logging.py`

Training and evaluation logging helpers.

---

## Training Data Design

Your training set should not just be generic bilingual chat. It should teach the model how to be a language tutor.

### Each training example should ideally include

- native language
- target language
- learner proficiency level
- desired code-switch ratio
- conversation history
- assistant response
- token- or span-level language labels
- optional correction labels
- optional vocabulary difficulty labels

### Good source categories

- public code-switching corpora
- bilingual dialogue datasets
- tutoring conversations
- synthetic examples generated from strong bilingual prompts and then human-filtered
- anonymized real product conversations, if users consent

### Important caution

Many public bilingual datasets are conversational but not pedagogical. You will likely need to transform them into tutoring-style examples or synthesize additional data.

---

## Ratio Control Design

A key product requirement is explicit control over the amount of target language in each response.

### Recommended implementation

Use both of these:

- prompt-level instruction: tell the model the desired target-language share and allowed switch pattern
- post-generation validation: measure the actual ratio and regenerate if it is too far off

### Example internal policy output

```json
{
  "native_language": "English",
  "target_language": "Spanish",
  "desired_ratio": {
    "native": 0.9,
    "target": 0.1
  },
  "switch_style": "short_target_phrases",
  "max_new_words": 3,
  "correction_mode": "gentle"
}
```

This policy object should be computed before each assistant response.

---

## Persistence and Analytics

The app should log enough information to improve learning quality and model quality without storing unnecessary sensitive data.

### Store

- transcripts
- language tags
- desired versus actual code-switch ratio
- latency
- corrections
- vocabulary introduced
- learner feedback
- session outcome metrics

### Avoid storing unless clearly justified

- raw audio forever
- unnecessary personally identifying data
- sensitive freeform notes without consent

---

## Infrastructure Files

#### `infra/docker/web.Dockerfile`

Builds the frontend container.

#### `infra/docker/api.Dockerfile`

Builds the backend API and realtime service container.

#### `infra/docker/model.Dockerfile`

Builds the training or self-hosted inference environment.

#### `infra/compose.yaml`

Local development stack for web, api, database, cache, and optional model server.

#### `infra/terraform/main.tf`

Main cloud infrastructure definitions.

#### `infra/terraform/variables.tf`

Input variables for infrastructure deployment.

#### `infra/terraform/outputs.tf`

Useful outputs such as service URLs, bucket names, or database connection information.

#### `infra/monitoring/prometheus.yml`

Prometheus scraping config for service metrics.

#### `infra/monitoring/grafana-dashboard.json`

Dashboard for latency, websocket health, model performance, and user-session metrics.

---

## Testing Files

#### `tests/web/microphone-button.test.tsx`

Verifies recording controls and permission-state UI behavior.

#### `tests/web/ratio-meter.test.tsx`

Verifies ratio display logic and progress rendering.

#### `tests/api/test_sessions.py`

Verifies session lifecycle behavior and summary generation.

#### `tests/api/test_ratio_policy.py`

Verifies that learner progression rules produce the correct target-language ratio.

#### `tests/api/test_code_switch_detector.py`

Verifies language tagging and ratio computation.

#### `tests/api/test_prompt_builder.py`

Verifies that prompts include the right learner state, ratio instructions, and memory.

#### `tests/model/test_build_examples.py`

Verifies dataset construction and schema correctness.

#### `tests/model/test_code_switch_metrics.py`

Verifies evaluation metrics for ratio compliance and switch quality.

#### `tests/model/test_quality_filters.py`

Verifies corpus cleaning and exclusion logic.

---

## Suggested MVP Build Order

1. Build the web session screen and microphone streaming.
2. Build backend websocket audio ingestion and turn detection.
3. Connect STT and TTS providers.
4. Add a general LLM with prompt-based code-switch control.
5. Implement ratio policy and response validation.
6. Add learner profile, progress tracking, and vocabulary extraction.
7. Add session summaries and analytics.
8. Add training-data export pipeline.
9. Fine-tune adapters on bilingual tutoring data.
10. Evaluate and deploy a specialized model.

---

## Final Recommendation

For a hackathon, do not begin by training a large custom model from scratch.

Build the app around:

- a strong multilingual base model
- a strict code-switch control layer
- speech input and output
- learner-state tracking

Then use the architecture above to evolve into a specialized bilingual tutoring system with its own fine-tuned code-switching model.
