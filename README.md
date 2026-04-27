# DocMind 🧠

An AI-powered document Question & Answer web application. Upload PDF documents and interactively ask questions about their contents — powered by a full RAG (Retrieval-Augmented Generation) pipeline with real-time streaming responses.

---

## Screenshots

### Upload Page
> *(Add screenshot here)*

### Chat Interface
> *(Add screenshot here)*

---

## Features

- Drag & drop PDF upload with instant processing
- Semantic search over document content using FAISS vector search
- CrossEncoder reranking for higher answer relevance
- Real-time streaming AI responses (typewriter effect)
- Session-based chat history with LocalStorage persistence
- Clean, minimalist Airbnb-style UI

---

## Tech Stack

### Backend (Python / FastAPI)

| Component | Technology |
|---|---|
| API Framework | FastAPI |
| Document Parsing | PyPDF |
| Embeddings | SentenceTransformers |
| Vector Database | FAISS |
| Reranking | CrossEncoder (ms-marco-MiniLM-L-6-v2) |
| LLM | Groq API |
| Streaming | Server-Sent Events (SSE) |

### Frontend (React / Next.js)

| Component | Technology |
|---|---|
| Framework | Next.js (App Router) |
| UI Library | React |
| Styling | Tailwind CSS v4 |
| State | React Hooks + LocalStorage |
| Language | TypeScript |

---

## Architecture

```
PDF Upload
    ↓
Text Extraction (PyPDF)
    ↓
Document Chunking
    ↓
Embeddings (SentenceTransformers)
    ↓
Vector Indexing (FAISS)
    ↓
Query → Semantic Search → Top-K Chunks
    ↓
Reranking (CrossEncoder)
    ↓
Context Injection → Groq LLM
    ↓
Streamed AI Answer (SSE → Frontend)
```

---

## Project Structure

```
docmind/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Upload page
│   │   └── ask/
│   │       └── page.tsx      # Chat interface
│   └── package.json
├── images/
│   └── screenshots/
└── README.md
```

---

## Installation

### 1. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

> **Note:** You will need a [Groq API key](https://console.groq.com/). Set it as an environment variable:
> ```bash
> export GROQ_API_KEY=your_key_here
> ```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Usage

1. Open the app and drag & drop one or more PDF files onto the upload page.
2. Wait for processing (chunking, embedding, and indexing happen automatically).
3. Navigate to the **Ask** page.
4. Type a question — the AI retrieves the most relevant document sections, reranks them, and streams a context-grounded answer back in real time.

### Example Questions

- *Summarize the key points of this document.*
- *What conclusions does the author draw?*
- *Explain the methodology described in section 3.*
- *What are the main risks mentioned?*

---

## Author

**Muhammed Muflim Subair**
BTech in Artificial Intelligence — Srinivas Institute of Technology, Mangalore
