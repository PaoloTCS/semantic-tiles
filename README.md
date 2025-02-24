# Semantic Tiles

A hierarchical knowledge mapping application that uses Voronoi tessellation combined with semantic analysis for visualizing knowledge domains and documents.

## Features

- Create hierarchical knowledge maps using Voronoi tessellation
- Add and delete knowledge domains at any level
- Upload and view documents (PDFs, etc.)
- Query documents using AI analysis
- Visualize semantic relationships between domains and documents
- Organize information with visual relationships that reflect semantic proximity

## Architecture

The application consists of:

- React frontend for visualization and user interface
- Flask backend for document processing and semantic analysis
- OpenAI API integration for semantic embeddings

## Setup

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python run.py
```

## Environment Variables

Create a `.env` file in the backend directory with:

```
OPENAI_API_KEY=your_api_key_here
FLASK_ENV=development
SECRET_KEY=your_secret_key
```
