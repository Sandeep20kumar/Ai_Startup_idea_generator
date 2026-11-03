# How to demonstrate the 10 Agent Technology assignments

The dashboard navigation opens the React pages. Assignment evidence is shown in the generator page and in the Python backend's JSON/API output; not every assignment is a separate dashboard page.

## Run the app

Terminal 1 (from project root):

```bash
cd agent_backend
python server.py
```

Terminal 2 (from project root):

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Go to **Generate Startup**, fill in the form, and generate a plan. The **Assignment Agent Evaluation** panel appears when the Python API is connected. Expand **View rules, BDI intentions and ranked candidates** to show details.

## Assignment-to-output map

| Assignment | What to show in a demo | Where it is demonstrated |
|---|---|---|
| 1.1 PEAS / environment | PEAS matrix and environment characteristics | `README.md` and `docs/ASSIGNMENT_MAPPING.md`; explain the inputs and outputs in the UI |
| 1.2 Rule-based reasoner | Rules fired for the entered startup profile | Generate Startup → Assignment Agent Evaluation → “View rules…” |
| 2.1 Threads / background worker | Worker/event records and concurrency behavior | Backend code in `agent_backend/agent_core.py`; `/api/status` exposes recent events |
| 2.2 Socket messaging | Start backend; show socket listener on port 8765 and signed message handling | Terminal output from `python server.py`; socket implementation in `agent_core.py` |
| 3.1 Multi-agent coordination | Specialist-agent consensus result | Generate Startup → Assignment Agent Evaluation; inspect `agent_negotiation` in API JSON |
| 3.2 Utility optimization | Ten candidates sorted by utility score | Generate Startup → “Top 10 ranking” |
| 4.1 BDI architecture | BDI revision and intentions | Generate Startup → “BDI plan revision” and “Current intentions” |
| 4.2 Knowledge + REST | JSON knowledge base and API response; optional market context source | `agent_backend/knowledge_base.json`; backend `/api/generate` response |
| 5.1 Message security | Accepted signed message; tampered and unknown sender rejected | Send POST to `http://127.0.0.1:8000/api/security/test` (examples below) |
| 5.2 Integration | React plan + Python agent evaluation on the same generated input | Generate Startup page with “Python agents connected” status |

## Show security output in the browser console or terminal

With the backend running, run this in a new terminal:

```bash
python -c "import urllib.request; r=urllib.request.Request('http://127.0.0.1:8000/api/security/test', data=b'{}', headers={'Content-Type':'application/json'}, method='POST'); print(urllib.request.urlopen(r).read().decode())"
```

Expected behavior: `valid_message.accepted` is true; `tampered_message.accepted` and `unknown_sender.accepted` are false. Exact explanatory text can vary by implementation.

## Important accuracy note

The React generator still creates the readable business-plan report locally. The Python backend runs the assignment-specific reasoning in parallel and exposes its evaluation in the Assignment Agent Evaluation panel. For the presentation, distinguish these two outputs rather than claiming every assignment is a separate page or that the local plan generator itself is a live LLM.
