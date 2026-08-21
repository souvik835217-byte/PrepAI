# PrepAI

PrepAI is a full-stack interview preparation platform that combines AI-powered mock interviews, resume analysis, and structured data-structures-and-algorithms practice in one place.

## Features

- AI-generated mock interviews tailored to a selected company and role
- Resume upload and AI-assisted resume analysis
- Interview feedback, results, history, and dashboard analytics
- DSA topic practice with an in-browser Monaco code editor
- Code execution for JavaScript, Python, Java, and C++
- AI code hints and code reviews
- Contests, leaderboards, submission history, and progress tracking
- Personalized DSA learning roadmaps
- Firebase authentication and protected application routes
- Downloadable interview reports

## Tech stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router, Firebase, Framer Motion, Monaco Editor, Recharts, Axios, and jsPDF.

**Backend:** Node.js, Express, MongoDB with Mongoose, Google Gemini, Multer, PDF.js, and Judge0.

## Project structure

```text
PrepAI/
|-- client/                 # React frontend
|   |-- public/
|   `-- src/
|       |-- components/
|       |-- dsa/            # DSA practice and contest UI
|       |-- pages/
|       `-- routes/
|-- server/                 # Express API
|   |-- controllers/
|   |-- dsa/                # DSA data, execution, and APIs
|   |-- models/
|   |-- routes/
|   `-- services/
`-- README.md
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB database
- A Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/souvik835217-byte/PrepAI.git
cd PrepAI
```

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure the backend

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key

# Optional
GEMINI_INTERVIEW_MODEL=your_preferred_model
GEMINI_EVALUATION_MODEL=your_preferred_model
GEMINI_FALLBACK_MODEL=your_fallback_model
JUDGE0_API_URL=https://ce.judge0.com
```

### 4. Configure the frontend

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Configure the Firebase project used by the client in `client/src/firebase/firebase.js`.

### 5. Start the application

Run the backend:

```bash
cd server
npm run dev
```

In another terminal, run the frontend:

```bash
cd client
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:5000`; its health endpoint is available at `http://localhost:5000/api/health`.

## Available scripts

### Frontend

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run lint      # Run Oxlint
npm run preview   # Preview the production build
```

### Backend

```bash
npm run dev       # Start with Nodemon
npm start         # Start with Node.js
```

## Security

Never commit `.env` files, API keys, database credentials, or private Firebase service credentials. Restrict production CORS origins and apply appropriate rate limits before deployment.

## Author

**Souvik Das**

- GitHub: [@souvik835217-byte](https://github.com/souvik835217-byte)

## License

No license has been specified yet. Add a `LICENSE` file before allowing third-party reuse or redistribution.
