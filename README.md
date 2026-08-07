# Hands For Homeless (HFH)

Hands For Homeless (HFH) is a humanitarian digital platform developed to connect homeless individuals with volunteers, donors, and support organizations through a simple, secure, and accessible online system.

## Project Structure

This project uses a monorepo setup containing the frontend, backend, and database schema:

- **`frontend/`**: Next.js (App Router, TypeScript, Tailwind CSS)
- **`backend/`**: Python Flask API
- **`supabase/`**: Supabase PostgreSQL schemas & configurations

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- Supabase account/CLI

### Setup Frontend
1. Navigate to `/frontend`
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and set variables
4. Run `npm run dev`

### Setup Backend
1. Navigate to `/backend`
2. Create python virtual env: `python3 -m venv venv` and activate it
3. Install dependencies: `pip install -r requirements.txt`
4. Copy `.env.example` to `.env` and set variables
5. Run backend: `python app.py`
