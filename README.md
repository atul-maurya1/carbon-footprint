# 🌿 CarbonTrace — AI Carbon Footprint Awareness Platform

CarbonTrace (EcoGuide AI) is a MERN stack web application designed to help users track, understand, and reduce their carbon footprint using AI-powered coaching and gamified community challenges.

---

## 🚀 Key Features

* **AI Eco-Coach** — Interact with a Gemini-powered sustainability coach with full footprint context.
* **Smart Activity Logger** — Manual logging, NLP text parsing, and receipt scanning.
* **Real-Time CO₂ Calculator** — Built-in calculators mapping 60+ emission factors across transport, food, energy, shopping, and waste.
* **Personalized Insights** — Automated weekly insights and top recommendations customized to user profiles.
* **Gamification** — Gain XP, level up, maintain streaks, and view community leaderboards.
* **Eco Challenges** — Browse and join challenges to reduce CO₂ impact.
* **Visual Analytics** — Recharts-powered interactive charts.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite + Vanilla CSS (w/ TailwindCSS) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB (Mongoose) |
| **AI Integration** | Google Gemini 1.5 Flash (via `@google/generative-ai`) |
| **Auth** | JSON Web Tokens (JWT) + Bcryptjs hashing |
| **Charts** | Recharts |
| **Icons** | Lucide React |

### Directory Layout
```
carbon-footprint/
├── client/          # React + Vite frontend SPA
└── server/          # Node + Express REST API server
```

---

## ⚡ Quick Start

### Prerequisites
* Node.js 18+
* MongoDB (Local instance running at `mongodb://localhost:27017` or a MongoDB Atlas URI)
* Google AI Studio Gemini API key (optional - fallback algorithms handle requests if keys are omitted)

### 1. Installation
Install project dependencies for both packages:
```bash
# Install client package dependencies
cd client
npm install

# Install server package dependencies
cd ../server
npm install
```

### 2. Configure Environment Variables
* **Server**: Copy `server/.env.example` to `server/.env` and supply your database connection and API keys:
  ```env
  PORT=3001
  NODE_ENV=development
  MONGODB_URI=your-mongodb-connection-string
  JWT_SECRET=your-jwt-signing-secret
  GEMINI_API_KEY=your-gemini-api-key
  CLIENT_URL=http://localhost:5173
  ```
* **Client**: Ensure `client/.env` has:
  ```env
  VITE_API_URL=http://localhost:3001/api/v1
  ```

### 3. Start Development Servers
Start both servers concurrently to run the project locally.

* **Backend Dev Server**:
  ```bash
  cd server
  npm run dev
  # Starts node server using nodemon on port 3001
  ```
* **Frontend Dev Server**:
  ```bash
  cd client
  npm run dev
  # Starts Vite server on port 5173
  ```

Open **[https://carbon-footprint-frontend-dun.vercel.app/](https://carbon-footprint-frontend-dun.vercel.app/)** in your browser. 🌿

---

## 🔧 Resolved Code Corrections

We resolved several bugs to make this codebase fully functional:
* **Mongoose Hook Crash**: Corrected the async pre-save hooks inside [User.model.js](file:///C:/Users/ASUS/OneDrive/Desktop/carbon-footprint/server/src/models/User.model.js) to follow standard Promise-based lifecycle execution, removing callback errors during registration.
* **Axios Interceptor Loops**: Overhauled response token checking in [api.js](file:///C:/Users/ASUS/OneDrive/Desktop/carbon-footprint/client/src/services/api.js) so that credential errors (401) on public routes or login pages are not forcefully redirected, enabling credential error states to render properly.
* **Component Rendering & React Compilation**: Resolved compiler errors by moving UI rendering functions (like `PodiumSlot` in [LeaderboardPage.jsx](file:///C:/Users/ASUS/OneDrive/Desktop/carbon-footprint/client/src/pages/LeaderboardPage.jsx)) to module-level scopes, and corrected React Element type exceptions on custom input/button icons.
* **Layout Sizing & Chart dimension bugs**: Added safety dimensions props (`minWidth` and `minHeight`) to `<ResponsiveContainer>` blocks to clean up Recharts console warnings, and adjusted layout dimensions (`ml-64`) on all dashboard layouts to respect fixed sidebars.
* **AI Chat & Insights Response Parsing**: Corrected destructuring accessors to fetch backend replies from `data?.data` (e.g. `data?.data?.reply`) instead of `data?.reply`, enabling dynamic chatbot responses and insights mapping on the insights dashboard.

For a full log of modifications, check **[auth_bug_fix_report.md](file:///C:/Users/ASUS/.gemini/antigravity-cli/brain/12ae9448-203e-422b-8e0d-57053a6ea824/auth_bug_fix_report.md)**.

---

## 🧪 Testing

An automated integration test suite has been added to verify backend REST endpoints. The tests execute real HTTP calls verifying health checks, user registration, login, JWT authentication, AI advice, and activity logging lifecycles.

### Running Integration Tests:
Run the test script from the root of the server directory:
```bash
cd server
node test-api.js [TARGET_URL]
```
*(If no `TARGET_URL` is provided, it defaults to testing the local server at `http://localhost:3001/api/v1`)*

---

## 🚀 Deployment

Refer to **[deployment_guide.md](file:///C:/Users/ASUS/.gemini/antigravity-cli/brain/12ae9448-203e-422b-8e0d-57053a6ea824/deployment_guide.md)** for detailed steps on deploying this stack to Render (backend Express API) and Vercel/Netlify (Vite React frontend).
