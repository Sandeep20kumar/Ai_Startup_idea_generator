# AI Startup Idea Generator - Complete Project

## Run in VS Code (Windows)
1. Extract this ZIP completely. Open the `ai-startup-idea-generator` folder in VS Code.
2. Terminal 1 (backend): `cd agent_backend` then `python server.py`. Keep it open. If needed use `py server.py`.
3. Terminal 2 (frontend), from the project root: `npm install` then `npm run dev`.
4. Open the Local URL Vite prints in the terminal.

## Dashboard navigation
The sidebar uses TanStack Router links to `/`, `/generate`, `/saved`, `/templates`, `/settings`, and `/about`. Matching route files are in `src/routes/`. If a link still does not navigate, open browser DevTools (F12), inspect the first red Console error, and check the Vite terminal.

## Assignment outputs
See `docs/ASSIGNMENT_OUTPUT_GUIDE.md` and `docs/ASSIGNMENT_MAPPING.md` for each assignment's implementation and evidence. Standalone Python assignment prototypes do not automatically stream output into the React UI unless the guide explicitly says so. The generator page includes specialist agent reports, utility score explanations, BDI intentions, knowledge triples, and a dynamic replanning change log. Changing inputs and generating again calls `/api/replan`. Available endpoints include `/api/generate`, `/api/replan`, `/api/status`, and `/api/security/test`.

## Tests
From the project root: `cd agent_backend` then `python -m unittest -v test_agent.py`.
The tests validate backend agent logic; they do not prove every frontend button works in every browser. Utility scores are educational heuristics, not predictions of commercial success.
