# Run the integrated Agent Technology backend

## Requirements
- Python 3.10 or newer
- Node.js 20+ and npm (for the React frontend)

## 1. Start Python agent service
Open a terminal in the project root:

```bash
cd agent_backend
python server.py
```

The HTTP API runs at `http://127.0.0.1:8000`; the authenticated TCP agent listener runs at `127.0.0.1:8765`. Keep this terminal open.

## 2. Start React frontend
Open a second terminal in the project root:

```bash
npm install
npm run dev
```

Open the local Vite URL printed in the terminal (usually `http://localhost:5173`). On the Generate page, submit the startup form. The existing plan generator displays the full business plan, and the connected Python service adds a separate **Assignment Agent Evaluation** panel. If Python is stopped, the frontend still shows the existing locally generated plan and marks the backend as offline.

## 3. Test assignments and security
Open a third terminal:

```bash
cd agent_backend
python -m unittest -v test_agent.py
```

With the backend running, test security in another terminal:

```bash
curl -X POST http://127.0.0.1:8000/api/security/test -H "Content-Type: application/json" -d "{}"
```

Test the agent API:

```bash
curl -X POST http://127.0.0.1:8000/api/generate -H "Content-Type: application/json" -d "{\"domain\":\"Education\",\"audience\":\"Students\",\"budget\":\"Low (< ₹50,000)\",\"country\":\"India\",\"goal\":\"Solve a Problem\",\"technology\":\"AI\"}"
```

## 4. Optional live REST context
Enable the optional public search context by adding `"use_live_api": true` to `/api/generate` request JSON. The endpoint is best-effort: if internet access or the service is unavailable, the agent explains the fallback and uses the bundled knowledge base. Search snippets are context only, not validated market research.

## Important
- Run `python server.py` from inside `agent_backend` so the local JSON knowledge file is found.
- The demo API binds to localhost only by default. Do not expose it publicly without authentication, rate limiting, HTTPS, input limits and deployment hardening.
- The socket listener uses HMAC and an allowlist. Set a strong `STARTUP_AGENT_SECRET` environment variable for the same secret across trusted local agents.
- Assignment 2.2's socket listener is a minimal classroom protocol and accepts one JSON message per TCP connection. Do not use this demo protocol as-is for production.
