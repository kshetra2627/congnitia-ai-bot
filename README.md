# Cognitia AI Assistant

## Project Overview
This is a full-stack conversational AI web application where users can ask a question and get an AI-generated response.

## Features
- Accepts a single user query
- Uses Groq API for AI responses
- Stores question and answer in MongoDB Atlas
- Displays answer in UI

## Tech Stack
- Backend: Node.js, Express
- Frontend: React (Vite)
- Database: MongoDB Atlas
- AI: Groq (llama-3.1-8b-instant)

## Project Structure
/frontend
/backend

## Setup

Backend:
cd backend
npm install
node index.js

Frontend:
cd frontend
npm install
npm run dev

## API

POST /ask

Request:
{
  "question": "What is AI?"
}

Response:
{
  "answer": "AI is..."
}
