# Assignment mapping — AI Startup Idea Generator

| Assignment | Project-specific implementation | Evidence / location |
|---|---|---|
| 1.1 PEAS and environment | The agent senses domain, target audience, budget, country, goal, technology, interests and skills; acts by generating, ranking and explaining startup concepts. | `README.md`, this document, `agent_backend/knowledge_base.json` |
| 1.2 Rule-based reasoner | Condition-action rules adapt ranking to domain, audience, budget, goal and skills. | `agent_backend/agent_core.py:rule_reasoner` |
| 2.1 Concurrent daemon workers | A daemon background worker receives tasks through a thread-safe queue and stores event records under a lock. | `agent_backend/agent_core.py:BackgroundMonitor` |
| 2.2 Socket messaging | JSON messages can be sent to the local TCP socket listener on port 8765. The server validates the sender and HMAC before accepting payloads. | `agent_backend/agent_core.py:agent_socket_server`, `agent_backend/server.py` |
| 3.1 Multi-agent coordination | Idea, market and feasibility specialist agents return proposals for each candidate; the coordinator records consensus and ranks the results. | `agent_backend/agent_core.py:coordinate` |
| 3.2 Utility optimization | Ten startup candidates are scored with preference fit, demand, feasibility, competition opportunity and budget fit. | `agent_backend/agent_core.py:utility`, `CANDIDATES` |
| 4.1 BDI architecture | Beliefs store user requirements and selected recommendation; desires state strategic goals; intentions are recalculated after belief changes. | `agent_backend/agent_core.py:BDIManager` |
| 4.2 Knowledge + REST API | Domain rules and fallback knowledge are stored as JSON. Optional live context is fetched from the Wikimedia search API; failures fall back to local knowledge. | `agent_backend/knowledge_base.json`, `live_market_context` |
| 5.1 Security | HMAC-SHA256 signatures, trusted sender allowlist, timestamp validation and tamper rejection protect socket messages. | `signed_message`, `verify_message`, `/api/security/test` |
| 5.2 Consolidation | Existing React app calls the Python API during generation and displays the selected recommendation, utility score, consensus, BDI revision and ranked ideas. | `src/routes/generate.tsx`, `agent_backend/server.py` |

## PEAS profile
- **Performance:** relevance to user preferences, budget fit, feasibility, demand, competition opportunity, transparent reasoning, response latency, and safe rejection of unauthenticated commands.
- **Environment:** a user-provided startup profile, a curated set of ten candidate patterns, local structured knowledge, and optional public search results.
- **Actuators:** generate candidates, calculate utility scores, request specialist-agent proposals, update BDI intentions, return recommendations, and accept/reject authenticated socket messages.
- **Sensors:** user form fields, local knowledge JSON, specialist-agent proposals, optional REST API responses, and incoming signed network messages.
- **Environment classification:** partially observable (market information is incomplete), stochastic (external context and user needs can change), sequential (belief updates affect later planning), dynamic (market/user context can change), mostly discrete, and multi-agent.

## Utility function
The implementation uses a 0–100 score from five components: preference fit (35%), market demand (25%), feasibility (20%), competition opportunity (10%), and budget fit (10%). This is a heuristic decision aid, not a verified market forecast. A higher score means a better match under the chosen weights, not guaranteed startup success.

## Security note
The default HMAC secret is for local classroom demonstration only. Set `STARTUP_AGENT_SECRET` to a long random secret before use beyond a local demo. HMAC provides message integrity/authentication among parties sharing the secret; it is not public-key signing and does not replace TLS or production identity management.


## Multi-agent capstone upgrade
- **Specialist agents:** idea, market, feasibility, audience-fit and risk agents return structured proposals per candidate.
- **Utility reasoning:** each ranked candidate includes weighted component scores and explanations.
- **BDI/replanning:** beliefs encode user requirements; changed inputs trigger `/api/replan` and a visible change log.
- **Knowledge representation:** API returns subject-predicate-object triples from the curated candidate ontology.
- **Security:** HMAC-SHA256, trusted-sender allow-list, timestamp validation and in-memory nonce replay protection.
- **Dashboard:** displays agent reports, score breakdowns, ranking, BDI intentions, knowledge triples and replanning output.

Limitations: the demand, competition, feasibility and risk values are curated teaching examples, not validated market research. Nonces are stored in memory and reset on restart. Before deployment, configure a strong `STARTUP_AGENT_SECRET`, use TLS, durable replay protection, rate limits, and strict input schemas.
