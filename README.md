# Cognitia AI - Round 2 Submission

## Project Overview
Cognitia AI is a full-stack conversational web application that allows users to interact with an AI assistant. The system is designed for single-turn interactions (one question to one response) and persists these interactions in a MongoDB database.

## Tech Stack
- **Frontend**: React.js with Vite
- **Backend**: Node.js with Express
- **AI Model**: Groq API (llama-3.1-8b-instant)
- **Database**: MongoDB Atlas
- **Styling**: Vanilla CSS (ChatGPT-inspired dark theme)

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account and URI
- Groq API Key

### Backend Setup
1. Navigate to the `/backend` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file with:
   ```env
   MONGO_URI=your_mongodb_atlas_uri
   GROQ_API_KEY=your_groq_api_key
   PORT=3000
   ```
4. Run the server: `node index.js`.

### Frontend Setup
1. Navigate to the `/frontend` directory.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.
4. Access the app at `http://localhost:5173`.

## API Usage Details
- **POST `/ask`**: Accepts a JSON body `{ "question": "string" }`. Returns the AI-generated answer.
- **GET `/history`**: Fetches all stored question-answer pairs from MongoDB.
- **DELETE `/history`**: Clears all interactions from the database.

## Deployment Steps (Vercel)
1. Push the repository to GitHub.
2. **Backend**:
   - Create a new project in Vercel.
   - Select the repository and set the root directory to `backend`.
   - Add Environment Variables (`MONGO_URI`, `GROQ_API_KEY`).
   - Deploy.
3. **Frontend**:
   - Create a second project in Vercel.
   - Select the repository and set the root directory to `frontend`.
   - Set the `API_BASE` in the code to point to your deployed Vercel backend.
   - Deploy.
