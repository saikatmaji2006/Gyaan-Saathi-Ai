<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success.svg?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/React-18-61DAFB.svg?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688.svg?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Llama_4_Scout-Powered-0452C8.svg?style=for-the-badge&logo=meta" alt="Llama 4 Scout" />
  <br />
  <h1>🚀 GyaanSaathi AI</h1>
  <h3>AI Co-Pilot for Teachers in a Classroom</h3>
  <p>Empowering educators in rural India through accessible, multilingual, AI-powered smart-board lessons.</p>
</div>

<hr />

## 🌟 Vision & Social Impact

India's government schools face significant challenges: high student-to-teacher ratios, language barriers, and a lack of personalized educational attention. **GyaanSaathi AI** is an AI Co-Pilot designed to assist teachers directly in the classroom.

By utilizing a **voice-first interface**, GyaanSaathi allows teachers to rapidly generate lessons and quizzes on the fly while interacting with the classroom. The platform dynamically generates smart-board lessons, visual explanations, and interactive verbal quizzes in **Hinglish** (and local vernaculars), ensuring complex concepts are easily understood by the students.

---

## 🛠️ Technical Architecture

GyaanSaathi is built on a modern, highly scalable microservices architecture optimized for speed and low latency, essential for voice interactions in a live classroom setting.

### Frontend (Client-Side)
- **Framework**: React 18 + Vite for blazing-fast HMR and optimized builds.
- **State Management**: Zustand — providing a lean, centralized, and immutable global state store.
- **Styling**: TailwindCSS v4 with a custom responsive design system (Blue/White modern aesthetic).
- **Animations**: Framer Motion for buttery-smooth micro-interactions, layout transitions, and dynamic SVG mascot rendering.
- **Voice APIs**: Native Web Speech API for real-time STT (Speech-to-Text), minimizing network payloads during active listening.

### Backend (AI Engine)
- **Framework**: FastAPI (Python) — chosen for its asynchronous capabilities and extreme performance.
- **LLM Engine**: Groq Cloud API featuring **Meta Llama-4 Scout (17B)** for near-instantaneous inference and lesson generation.
- **Speech Engine**: Whisper Large v3 (via Groq) for robust fallback transcription, and Edge-TTS for low-latency, natural-sounding Hinglish text-to-speech.
- **Data Schemas**: Pydantic for rigid validation of AI-generated structured JSON responses.

---

## ✨ Core Features

### 1. The "Book Mascot" Conversational UI
A fully custom, animated SVG Book Mascot acts as the teacher's virtual assistant. The mascot responds to the application's global state (`idle`, `listening`, `thinking`, `speaking`, `celebrating`), offering a friendly visual aid for the classroom.

### 2. Voice-First Lesson Generation
The Teacher says:
*"Explain photosynthesis for Class 7"*

The AI generates:
- A progressive smart-board lesson.
- Visual and text-based explanations.
- A natural spoken explanation read aloud to the classroom.

### 3. Progressive Smart-Board Lessons
Lessons are rendered via the `CardRenderer` engine, which cycles through pedagogical components (Concept → Definition → Example → Practice → Real-World Application). The mascot "speaks" the lesson aloud, and the teacher can interrupt at any time to ask clarifying questions on behalf of the students.

### 4. Dynamic Visual Diagrams (Mermaid.js)
The AI is capable of generating real-time flowcharts, state diagrams, and mind maps using **Mermaid.js**. When explaining processes like the Water Cycle or Food Chain, the smart-board will automatically render a crisp SVG diagram card, providing powerful visual reinforcement for the lesson.

### 5. Adaptive Verbal Quizzes
The Teacher says:
*"Start Quiz"*

The AI launches a verbal quiz session. Students can answer collectively using the classroom microphone (*"Option B"*). The system provides progressive feedback:
- **Attempt 1**: Re-evaluation prompt.
- **Attempt 2**: Contextual hint generation.
- **Attempt 3**: Full concept reveal and explanation.

---

## 🔄 Teacher Workflow

```text
Teacher Voice Command
        ↓
Speech-to-Text
        ↓
Intent Classification
        ↓
Lesson / Quiz Generation
        ↓
JSON Validation
        ↓
Smart Board Rendering
        ↓
Voice Narration
        ↓
Student Responses
        ↓
Adaptive Feedback
```

---

## 🛡️ Prompt Safety & Educational Guardrails

GyaanSaathi is strictly constrained to ensure a safe classroom environment. Built deeply into the system prompts are robust educational guardrails:

- **Educational-only responses**: The AI explicitly refuses to answer queries related to medical, legal, political, or harmful advice, falling back to: *"I am GyaanSaathi and can only assist with educational topics."*
- **Intent classification**: Strict AI routing ensures commands are classified precisely (e.g., explain, quiz, simplify, translate).
- **JSON schema enforcement**: All generations are tightly constrained to return valid JSON formats, avoiding unpredictable unstructured outputs.
- **Pydantic validation**: The FastAPI backend validates all AI outputs against strict schemas before serving them to the smart-board.
- **Grade-level adaptation**: Explanations naturally adapt their vocabulary and depth based on the specified class level (e.g., Class 6 vs. Class 10).
- **Controlled hint generation**: The AI is prompted to provide progressive, encouraging hints *without* revealing the exact answer during quizzes.
- **Language constraints**: Enforced output in English, Hindi, or Hinglish (mixed) based on the teacher's configured classroom settings.

---

## 💻 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Groq API Key

### 1. Clone & Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt

# Create your .env file
echo "GROQ_API_KEY=your_api_key_here" > .env

# Run the FastAPI server
uvicorn main:app --reload --port 8000
```
*The backend will be available at `http://localhost:8000`*

### 2. Setup Frontend
```bash
cd src
npm install
npm run dev
```
*The frontend will launch at `http://localhost:5173`*

> **💡 Demo Mode**: If the backend is not running, the frontend automatically falls back to an intelligent offline Demo Mode using cached JSON data, allowing recruiters and testers to evaluate the UI and UX without setting up API keys!

---

## 🏗️ Project Structure Highlights
```text
├── src/
│   ├── components/
│   │   ├── common/        # Core UI: BookMascot (Animated SVG), SpeechBubble
│   │   ├── teaching/      # Abstracted pedagogical card components
│   │   └── voice/         # Audio processing UI: Waveform, MicButton
│   ├── pages/             # Route views: Landing, ExplanationWorkspace, QuizWorkspace
│   └── store/             # Zustand logic: useAppStore.js
└── backend/
    ├── routers/           # FastAPI endpoints: lesson.py, quiz.py, voice.py
    ├── prompts.py         # Highly engineered LLM system prompts
    └── services/          # Groq LLM and Edge-TTS integrations
```
## 🔗 Deliverables

Live Demo: <link>

GitHub Repository: <link>

Video Walkthrough: <link>

---

<div align="center">
  <p>Built with ❤️ to democratize education.</p>
</div>
