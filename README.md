# 📚 RAGuide AI · Textbook Tutor

> A full-stack AI tutor that reads your textbooks, answers questions, generates quizzes, and adapts to your learning pace — all running locally with complete privacy.

**Built with:** Django · Ollama · LangChain · LangGraph · ChromaDB · RAG · sentence-transformers

---

## 🎯 What This Does

- **Upload any PDF textbook** → system chunks and indexes every page
- **Ask natural language questions** → answers grounded only in your textbook (no hallucinations)
- **Generate adaptive quizzes** → difficulty increases as you answer correctly
- **Remember conversation context** → "Remember when we discussed chapter 3?"
- **Multi-step tutoring workflows** → wrong answer → hint → simplified explanation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Angular Frontend (RAGUIDE_AI_Frontend)         │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/SSE
┌─────────────────────────▼───────────────────────────────────┐
│                    Django (Backend API)                     │
│          • User sessions • PDF upload • REST endpoints      │
└─────────┬──────────────────────────────┬────────────────────┘
          │                              │
          ▼                              ▼
┌─────────────────────┐   ┌─────────────────────────────┐
│  Ollama (Local LLM) │   │    ChromaDB (Vector DB)     │
│  • Llama 2 / Mistral│   │    • 384-dim embeddings     │
│  • Streaming output │   │    • Semantic search <100ms │
└─────────────────────┘   └──────────────┬──────────────┘
                                         │
                                  ┌──────▼──────┐
                                  │ LangGraph   │
                                  │ Agent       │
                                  │• Conditional│
                                  │  workflows  │
                                  │• Memory     │
                                  └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

```bash
# Install Ollama (macOS/Linux/Windows WSL2)
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama2  # or mistral, phi3, etc.

# Verify it works
ollama run llama2 "Hello"
```

### Backend Setup

```bash
# Clone and enter project
git clone https://github.com/potatoandfries/RAGuide_AI.git
cd RAGuide_AI

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Enter backend and run migrations
cd RAGUIDE_AI_Backend
python manage.py migrate

# Start Django (with ChromaDB auto-creating)
python manage.py runserver
```

### Environment Variables

```bash
# .env file
OLLAMA_URL=http://localhost:11434
CHROMA_PERSIST_DIR=./chroma_data
EMBEDDING_MODEL=all-MiniLM-L6-v2
LLM_MODEL=llama2
```

---

## 📁 Project Structure

```
RAGuide_AI/
├── RAGUIDE_AI_Backend/     # Django REST API backend
│   ├── api/                # PDF upload, chunking, RAG endpoints
│   ├── raguide/            # Django project settings
│   └── manage.py
├── RAGUIDE_AI_Frontend/    # Angular frontend
├── venv/                   # Python virtual environment
├── requirements.txt
└── README.md
```

---

## 🔧 Core Code Snippets

### RAG Pipeline

```python
def rag_answer(question: str, textbook_id: str) -> str:
    # 1. Semantic search
    results = chroma_collection.query(
        query_texts=[question], 
        n_results=3,
        where={"source": textbook_id}
    )
    
    context = "\n\n".join(results['documents'][0])
    
    # 2. Grounded prompt
    prompt = f"""Using ONLY this textbook excerpt, answer the question.
    
    Excerpt: {context}
    Question: {question}
    
    If the answer isn't in the excerpt, say "The textbook doesn't cover this."
    Answer:"""
    
    # 3. Generate
    return ollama.generate(model="llama2", prompt=prompt)
```

### Adaptive Quiz Logic

```python
class AdaptiveTutor:
    def __init__(self, student_id):
        self.difficulty = "beginner"
        self.correct_streak = 0
    
    def next_question(self, chunk):
        if self.correct_streak >= 3:
            self.difficulty = "advanced"
        elif self.correct_streak == 0:
            self.difficulty = "beginner"
        
        prompt = f"Generate a {self.difficulty}-level question from: {chunk}"
        return generate_quiz_question(prompt)
    
    def evaluate(self, answer, correct):
        if correct:
            self.correct_streak += 1
        else:
            self.correct_streak = 0
            return self.provide_hint()
```

### LangGraph Workflow

```python
from langgraph.graph import StateGraph

workflow = StateGraph(TutorState)

# Nodes
workflow.add_node("question", generate_question)
workflow.add_node("evaluate", check_answer)
workflow.add_node("hint", provide_hint)
workflow.add_node("explain", full_explanation)

# Conditional edges
workflow.add_conditional_edges(
    "evaluate",
    lambda state: "hint" if state.attempts < 2 else "explain"
)

app = workflow.compile()
```

---

## 📊 Performance Metrics (Targets)

| Operation | Latency | Notes |
|-----------|---------|-------|
| Semantic search (3 chunks) | <100ms | ChromaDB + 384-dim |
| LLM response (first token) | <500ms | Ollama on CPU |
| PDF chunking (300-page book) | ~5s | pdfplumber |
| Quiz generation | 2-3s | 3 questions, llama2 |

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
