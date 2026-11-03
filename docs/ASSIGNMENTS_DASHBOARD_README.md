# Assignment Dashboard

A dedicated `/assignments` route has been added to the React application and an **Assignments** link has been added to the sidebar.

## Open it
1. Start the Python backend in one terminal: `cd agent_backend` then `python server.py`.
2. Start the frontend in another terminal from the project root: `npm run dev`.
3. Open the local URL printed by Vite and click **Assignments** in the sidebar, or navigate to `/assignments` (for example `http://localhost:8080/assignments`).
4. Click **Check connection** to test `http://127.0.0.1:8000/api/status`.
5. Expand any assignment card to see the demo checklist and evidence to capture.

The dashboard is an assignment index and demonstration guide. It does not claim to execute every standalone assignment program from the browser. Use each assignment's actual Python program or test for console output where the card says so. The route should be picked up by TanStack Router's Vite plugin; if the route tree is manually managed in your setup, regenerate/update `src/routeTree.gen.ts` using the project's normal router generation process.
