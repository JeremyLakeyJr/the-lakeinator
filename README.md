# The Lakeinator

An all-in-one OSINT platform designed for deep reconnaissance, link analysis, and intelligence automation.

## Architecture

- **Frontend (`/client`):** Next.js, React, Tailwind CSS. Designed for high-density data visualization and interactive graphing.
- **Backend (`/server`):** FastAPI (Python). Modular plugin-based engine for data aggregation and normalization.

## Phase 1: Foundation Status
- [x] Scaffold Next.js frontend
- [x] Scaffold FastAPI backend
- [x] Establish "Cyber" UI aesthetic
- [ ] Implement Intelligence Core Plugin system
- [ ] Setup Data Persistence (PostgreSQL/Neo4j)

## Getting Started

### Backend
1. `cd server`
2. `pip install -r requirements.txt`
3. `uvicorn main:app --reload`

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`
