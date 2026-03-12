from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader

from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import requests
import os
import pickle

# -----------------------------
# CONFIG
# -----------------------------

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "phi3"

CHUNK_SIZE = 800
CHUNK_OVERLAP = 150

FAISS_INDEX_FILE = "vector.index"
METADATA_FILE = "metadata.pkl"

TOP_K = 6

# -----------------------------
# FASTAPI INIT
# -----------------------------

app = FastAPI(title="AI Document QA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# DATA MODELS
# -----------------------------

class QuestionRequest(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    answer: str
    sources: list[str]

# -----------------------------
# GLOBAL OBJECTS
# -----------------------------

model = SentenceTransformer("all-MiniLM-L6-v2")

texts = []
sources = []
index = None

# -----------------------------
# LOAD EXISTING VECTOR INDEX
# -----------------------------

def load_index():
    global index, texts, sources

    if os.path.exists(FAISS_INDEX_FILE) and os.path.exists(METADATA_FILE):
        index = faiss.read_index(FAISS_INDEX_FILE)

        with open(METADATA_FILE, "rb") as f:
            data = pickle.load(f)

        texts = data["texts"]
        sources = data["sources"]

        print("✅ Vector database loaded")

def save_index():
    global index, texts, sources

    if index is None:
        return

    faiss.write_index(index, FAISS_INDEX_FILE)

    with open(METADATA_FILE, "wb") as f:
        pickle.dump(
            {"texts": texts, "sources": sources},
            f
        )

# Load index on startup
load_index()

# -----------------------------
# UTILS
# -----------------------------

def chunk_text(text: str):
    chunks = []

    for i in range(0, len(text), CHUNK_SIZE - CHUNK_OVERLAP):
        chunk = text[i:i + CHUNK_SIZE]
        chunks.append(chunk)

    return chunks


def embed_text(text_list):
    embeddings = model.encode(text_list)
    return np.array(embeddings).astype("float32")


def build_or_update_index(new_embeddings):

    global index

    if index is None:
        dimension = new_embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)

    index.add(new_embeddings)

# -----------------------------
# ROUTES
# -----------------------------

@app.get("/")
def home():
    return {"message": "AI Document QA API running"}

# -----------------------------
# UPLOAD PDF
# -----------------------------

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    global texts, sources

    try:

        pdf = PdfReader(file.file)

        full_text = ""

        for page in pdf.pages:
            content = page.extract_text()
            if content:
                full_text += content

        if not full_text:
            raise HTTPException(status_code=400, detail="PDF contains no readable text")

        chunks = chunk_text(full_text)

        embeddings = embed_text(chunks)

        build_or_update_index(embeddings)

        texts.extend(chunks)
        sources.extend([file.filename] * len(chunks))

        save_index()

        return {
            "message": f"{file.filename} uploaded",
            "chunks_added": len(chunks),
            "total_chunks": len(texts)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------
# ASK QUESTION
# -----------------------------

@app.post("/ask", response_model=AnswerResponse)
async def ask_question(data: QuestionRequest):

    global index

    if index is None:
        raise HTTPException(status_code=400, detail="Upload documents first")

    question = data.question

    q_embedding = embed_text([question])

    distances, indices = index.search(q_embedding, TOP_K)

    context_chunks = []
    context_sources = []

    for i in indices[0]:
        if i < len(texts):
            context_chunks.append(texts[i])
            context_sources.append(sources[i])

    context = "\n\n".join(context_chunks)

    prompt = f"""
You are an AI assistant answering questions from documents.

Rules:
- Only use the context provided
- If the answer is not in the documents say:
  "The documents do not contain this information"

Context:
{context}

Question:
{question}

Answer clearly.
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_predict": 300
            }
        }
    )

    result = response.json()

    answer = result.get("response", "No response from model")

    unique_sources = list(set(context_sources))

    return {
        "answer": answer,
        "sources": unique_sources
    }