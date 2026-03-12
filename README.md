# AI Document Q&A

AI-powered document question answering system using **Retrieval-Augmented Generation (RAG)**.

Upload PDFs and ask questions about them with contextual AI responses.

---

## Features

- Upload multiple PDF documents
- Ask questions about document content
- AI generates answers using relevant document context
- Source references included in responses
- Chat-style interface
- Local AI model using **Ollama (Phi3)**

---

## Tech Stack

### Backend
- FastAPI
- SentenceTransformers
- FAISS (Vector Database)
- Ollama
- Python

### Frontend
- Next.js
- React
- TypeScript
- Custom CSS

---

## Architecture


PDF Upload
↓
Text Extraction
↓
Chunking
↓
Embeddings (SentenceTransformers)
↓
Vector Search (FAISS)
↓
Retrieve Context
↓
LLM (Ollama - Phi3)
↓
AI Answer + Sources


---

## Project Structure


ai-doc-qa
│
├ backend
│ ├ main.py
│ └ requirements.txt
│
├ frontend
│ ├ app
│ │ ├ page.tsx
│ │ ├ ask/page.tsx
│ │ └ layout.tsx
│
└ README.md


---

## Installation

### 1 Install Ollama

Download from:

https://ollama.com

Then pull the model:


ollama pull phi3


---

### 2 Backend Setup


cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn main:app --reload


Backend runs at:


http://127.0.0.1:8000


---

### 3 Frontend Setup


cd frontend

npm install
npm run dev


Frontend runs at:


http://localhost:3000


---

## Usage

1. Upload PDF documents
2. Navigate to **Ask AI**
3. Ask questions about the documents
4. AI returns answers with sources

---

## Example Questions

- Summarize this document
- What are the key points?
- Explain the main topic
- What conclusions are mentioned?

---

## Author

- Muhammed Muflim Subair
