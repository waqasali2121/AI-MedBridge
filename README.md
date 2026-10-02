# MedBridge

**AI-Assisted Medicine Handover & Comprehension Platform**

---

## Overview

MedBridge is an intelligent healthcare platform designed to bridge the communication gap during medicine handovers. It leverages local AI models to help patients understand their prescriptions, enables pharmacists to verify and annotate medication instructions, and provides a structured workflow for safe, comprehensible medicine dispensing.

The platform combines a mobile patient app, a pharmacist web dashboard, and a FastAPI backend powered by locally-hosted LLMs via Ollama -- ensuring that sensitive medical data never leaves the hospital network.

---

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| **Backend API**    | Python 3.11+, FastAPI, SQLAlchemy   |
| **Database**       | PostgreSQL 16                       |
| **AI / LLM**       | Ollama (Qwen2 7B, local inference)  |
| **Mobile App**     | React Native (Expo)                 |
| **Pharmacist Web** | Next.js 14, React, TypeScript       |
| **Auth**           | JWT (access + refresh tokens)       |
| **File Storage**   | Local filesystem (Docker volume)    |
| **Containerization** | Docker & Docker Compose           |

---

## Prerequisites

Before getting started, ensure you have the following installed:

- **Python** 3.11 or higher
- **Node.js** 18 or higher (with npm)
- **PostgreSQL** 16
- **Docker** and **Docker Compose**
- **Ollama** (for local AI model inference)
- **Git**

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/medbridge.git
cd medbridge
```

### 2. Start Docker Services (Database + Ollama)

```bash
docker-compose up -d db ollama
```

This starts:
- **PostgreSQL** on `localhost:5432`
- **Ollama** on `localhost:11434`

### 3. Pull the AI Model

```bash
docker exec -it medbridge-ollama ollama pull qwen2:7b
```

> **Note:** The Qwen2 7B model is approximately 4.4 GB. The initial download may take several minutes depending on your connection speed.

### 4. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`.

### 5. Mobile App (Patient)

```bash
# Navigate to mobile app directory
cd mobile

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Scan the QR code with the Expo Go app on your device, or press `a` for Android emulator / `i` for iOS simulator.

### 6. Pharmacist Dashboard

```bash
# Navigate to web dashboard directory
cd pharmacist-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

---

## Project Structure

```
medbridge/
├── backend/                  # FastAPI backend application
│   ├── app/
│   │   ├── api/              # API route handlers
│   │   ├── core/             # Config, security, dependencies
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic & AI integration
│   │   └── main.py           # Application entry point
│   ├── alembic/              # Database migrations
│   ├── tests/                # Backend test suite
│   ├── Dockerfile
│   └── requirements.txt
├── mobile/                   # React Native (Expo) patient app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # App screens
│   │   ├── navigation/       # Navigation configuration
│   │   ├── services/         # API client & utilities
│   │   └── store/            # State management
│   ├── app.json
│   └── package.json
├── pharmacist-dashboard/     # Next.js pharmacist web app
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities & API client
│   └── package.json
├── docker-compose.yml        # Docker service orchestration
├── .gitignore
└── README.md
```

---

## API Documentation

Once the backend server is running, interactive API documentation is available at:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Safety Boundaries

MedBridge is designed with clear safety guardrails:

- **AI-generated content is always advisory.** All AI simplifications and summaries are flagged as AI-generated and require pharmacist verification before being presented to patients.
- **Pharmacist approval is mandatory.** No AI-generated medication explanation reaches a patient without explicit pharmacist review and approval.
- **No diagnostic or prescriptive advice.** The AI assists with comprehension of existing prescriptions only -- it does not diagnose conditions or recommend treatments.
- **Local-first data processing.** All AI inference runs on locally-hosted models via Ollama, ensuring patient data does not leave the hospital network.
- **Audit trail.** Every action -- AI generation, pharmacist edit, patient acknowledgment -- is logged for traceability and compliance.

---

## Team

| Role                | Name       |
| ------------------- | ---------- |
| Project Lead        | TBD        |
| Backend Developer   | TBD        |
| Mobile Developer    | TBD        |
| Frontend Developer  | TBD        |
| AI/ML Engineer      | TBD        |

---

## License

This project is licensed under [LICENSE](./LICENSE) -- see the LICENSE file for details.

---

<p align="center">
  Built with care for safer medicine handovers.
</p>
