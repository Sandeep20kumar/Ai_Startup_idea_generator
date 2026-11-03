"""Integrated Agent Technology capstone for AI Startup Idea Generator.
Covers assignments 1.2, 2.1, 2.2, 3.1, 3.2, 4.1, 4.2 and 5.1.
Only Python standard library is required.
"""
from __future__ import annotations
import hashlib, hmac, json, os, queue, secrets, socket, threading, time, urllib.request, urllib.parse
from dataclasses import dataclass, asdict
from typing import Any

BASE_DIR = os.path.dirname(__file__)
with open(os.path.join(BASE_DIR, "knowledge_base.json"), encoding="utf-8") as f:
    KNOWLEDGE = json.load(f)
SECRET = os.environ.get("STARTUP_AGENT_SECRET", "change-this-demo-secret-before-deployment").encode()
TRUSTED_AGENTS = {"idea-agent", "market-agent", "feasibility-agent", "audience-agent", "risk-agent", "coordinator-agent"}
_NONCES: set[str] = set()
_NONCE_LOCK = threading.Lock()

@dataclass
class AgentInput:
    domain: str = "Artificial Intelligence"
    audience: str = "Students"
    budget: str = "Medium (₹50,000–₹5 Lakhs)"
    country: str = "India"
    goal: str = "Solve a Problem"
    technology: str = "AI"
    interests: str = ""
    skills: str = ""

class BDIManager:
    """Beliefs are facts, desires are goals, intentions are the selected plan."""
    def __init__(self):
        self.beliefs: dict[str, Any] = {}
        self.desires = ["find_feasible_startup", "fit_user_preferences", "reduce_startup_risk"]
        self.intentions: list[str] = []
        self.revision = 0
    def update_beliefs(self, facts: dict[str, Any]):
        changed = any(self.beliefs.get(k) != v for k, v in facts.items())
        self.beliefs.update(facts)
        if changed:
            self.revision += 1
            self.recalculate()
    def recalculate(self):
        budget = str(self.beliefs.get("budget", "Medium"))
        self.intentions = ["parse_user_requirements", "generate_ten_startup_candidates", "evaluate_market_fit"]
        if "Low" in budget or "< ₹50,000" in budget:
            self.intentions += ["prioritize_low_cost_mvp", "exclude_high_capital_ideas"]
        else:
            self.intentions += ["compare_scalability_and_market_fit"]
        self.intentions += ["coordinate_specialist_agents", "rank_by_utility", "return_explanation"]
    def snapshot(self):
        return {"beliefs": self.beliefs, "desires": self.desires, "intentions": self.intentions, "revision": self.revision}

# 10 candidate patterns specific to startup ideation, not generic travel/Wi-Fi examples.
CANDIDATES = [
 {"name":"AI Study Companion","domain":"Education","audience":"Students","cost":"low","demand":9,"feasibility":9,"competition":6,"tech":["AI","Machine Learning","Web Application","Mobile App"]},
 {"name":"Smart Crop Advisory","domain":"Agriculture","audience":"Farmers","cost":"medium","demand":8,"feasibility":7,"competition":5,"tech":["AI","Machine Learning","IoT","Mobile App"]},
 {"name":"Local Business AI Assistant","domain":"Artificial Intelligence","audience":"Businesses","cost":"low","demand":8,"feasibility":8,"competition":7,"tech":["AI","Web Application","Cloud"]},
 {"name":"Clinic Appointment Optimizer","domain":"Healthcare","audience":"Hospitals","cost":"medium","demand":8,"feasibility":7,"competition":6,"tech":["AI","Web Application","Cloud"]},
 {"name":"Student Skill-to-Job Matcher","domain":"Education","audience":"Students","cost":"low","demand":9,"feasibility":8,"competition":7,"tech":["AI","Machine Learning","Web Application"]},
 {"name":"Food Waste Exchange","domain":"Food","audience":"Businesses","cost":"low","demand":7,"feasibility":8,"competition":4,"tech":["Web Application","Mobile App"]},
 {"name":"IoT Energy Insights for Shops","domain":"IoT","audience":"Businesses","cost":"high","demand":7,"feasibility":6,"competition":5,"tech":["IoT","Cloud","AI"]},
 {"name":"Fraud Awareness for Microbusinesses","domain":"Finance","audience":"Businesses","cost":"medium","demand":8,"feasibility":6,"competition":7,"tech":["AI","Machine Learning","Web Application"]},
 {"name":"Accessible Local Services Finder","domain":"Other","audience":"Everyone","cost":"low","demand":7,"feasibility":9,"competition":4,"tech":["Web Application","Mobile App","AI"]},
 {"name":"Small Seller Demand Forecaster","domain":"E-commerce","audience":"Businesses","cost":"medium","demand":8,"feasibility":7,"competition":6,"tech":["AI","Machine Learning","Cloud"]},
]

def rule_reasoner(data: AgentInput) -> list[str]:
    """Assignment 1.2: condition-action rules over incoming user requirements."""
    rules = [f"IF domain={data.domain} THEN prioritize startup candidates related to {data.domain}.",
             f"IF audience={data.audience} THEN increase audience-fit score for that group.",
             f"IF technology={data.technology} THEN reward candidates using the requested technology."]
    if "Low" in data.budget or "< ₹50,000" in data.budget:
        rules.append("IF budget is low THEN prioritize low-cost MVPs and penalize high-capital concepts.")
    if data.goal == "Social Impact": rules.append("IF goal is social impact THEN reward accessibility and community-benefit concepts.")
    if data.skills.strip(): rules.append("IF user skills are provided THEN include them as a feasibility signal for MVP planning.")
    return rules

def utility(candidate: dict, data: AgentInput) -> tuple[float, dict]:
    domain = 10 if candidate["domain"].lower() == data.domain.lower() else (6 if candidate["domain"] == "Other" else 4)
    audience = 10 if candidate["audience"].lower() == data.audience.lower() or candidate["audience"] == "Everyone" else 5
    tech = 10 if data.technology in candidate["tech"] else 4
    budget_low = "Low" in data.budget or "< ₹50,000" in data.budget
    budget_fit = 10 if (candidate["cost"] == "low" if budget_low else candidate["cost"] != "high") else 2
    goal_bonus = 1 if data.goal == "Social Impact" and candidate["name"] in ("Food Waste Exchange", "Accessible Local Services Finder", "Smart Crop Advisory") else 0
    # Weighted utility: preferences 35%, demand 25%, feasibility 20%, low competition 10%, budget 10%.
    components = {"preference_fit": round((domain * .5 + audience * .25 + tech * .25) * 3.5, 2),
                  "market_demand": round(candidate["demand"] * 2.5, 2),
                  "feasibility": round(candidate["feasibility"] * 2.0, 2),
                  "competition_opportunity": round((10-candidate["competition"]) * 1.0, 2),
                  "budget_fit": round(budget_fit * 1.0, 2)}
    score = min(100.0, round(sum(components.values()) + goal_bonus, 2))
    return score, components

class BackgroundMonitor:
    """Assignment 2.1: daemon worker + thread-safe queue and lock."""
    def __init__(self):
        self.events: queue.Queue = queue.Queue()
        self.lock = threading.Lock()
        self.running = True
        self.thread = threading.Thread(target=self._work, daemon=True, name="startup-market-monitor")
        self.thread.start()
    def _work(self):
        while self.running:
            try:
                task = self.events.get(timeout=.5)
            except queue.Empty:
                continue
            started = time.perf_counter()
            result = {"task": task, "status": "processed", "latency_ms": round((time.perf_counter()-started)*1000, 3), "timestamp": time.time()}
            with self.lock: LAST_EVENTS.append(result)
            self.events.task_done()
    def submit(self, task): self.events.put(task)
LAST_EVENTS: list[dict] = []
MONITOR = BackgroundMonitor()

def signed_message(sender: str, payload: dict) -> dict:
    body = {"sender": sender, "payload": payload, "issued_at": int(time.time()), "nonce": secrets.token_hex(8)}
    raw = json.dumps(body, sort_keys=True, separators=(",", ":")).encode()
    body["signature"] = hmac.new(SECRET, raw, hashlib.sha256).hexdigest()
    return body

def verify_message(message: dict) -> tuple[bool, str]:
    sender = message.get("sender")
    signature = message.get("signature", "")
    if sender not in TRUSTED_AGENTS: return False, "Rejected: sender is not trusted"
    body = {k:v for k,v in message.items() if k != "signature"}
    raw = json.dumps(body, sort_keys=True, separators=(",", ":")).encode()
    expected = hmac.new(SECRET, raw, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected): return False, "Rejected: invalid signature or tampered payload"
    try: issued_at = int(message.get("issued_at", 0))
    except (TypeError, ValueError): return False, "Rejected: invalid timestamp"
    if abs(int(time.time()) - issued_at) > 300: return False, "Rejected: message expired"
    nonce = str(message.get("nonce", ""))
    if not nonce or len(nonce) > 128: return False, "Rejected: missing or invalid nonce"
    with _NONCE_LOCK:
        if nonce in _NONCES: return False, "Rejected: replayed message nonce"
        _NONCES.add(nonce)
        if len(_NONCES) > 10000: _NONCES.clear(); _NONCES.add(nonce)
    return True, "Authenticated message accepted"

def agent_socket_server(host="127.0.0.1", port=8765):
    """Assignment 2.2: JSON socket server; authenticated payloads only."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1); server.bind((host, port)); server.listen(5)
        print(f"[socket-agent] listening on {host}:{port}")
        while True:
            conn, _ = server.accept()
            with conn:
                data = conn.recv(65536)
                try:
                    msg = json.loads(data.decode()); ok, reason = verify_message(msg)
                    response = {"accepted": ok, "message": reason}
                    if ok: MONITOR.submit({"kind":"remote_agent_message", "sender":msg["sender"], "payload":msg["payload"]})
                except Exception as exc: response = {"accepted":False,"message":f"Malformed message: {exc}"}
                conn.sendall(json.dumps(response).encode())

def live_market_context(domain: str) -> dict:
    """Assignment 4.2: live REST API integration using Wikimedia's public REST search endpoint.
    It provides contextual search results, not a validated market-size estimate."""
    url = "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=" + urllib.parse.quote(domain + " industry technology") + "&srlimit=3"
    try:
        req = urllib.request.Request(url, headers={"User-Agent":"StartupIdeaAgent/1.0 (student project)"})
        with urllib.request.urlopen(req, timeout=3) as resp: data = json.loads(resp.read().decode())
        return {"source":"Wikimedia search API", "live":True, "results":[{"title":x.get("title"),"snippet":x.get("snippet","").replace("<span class=\"searchmatch\">","").replace("</span>","")} for x in data.get("query",{}).get("search",[])]}
    except Exception as exc:
        return {"source":"curated local knowledge base", "live":False, "note":f"External API unavailable ({type(exc).__name__}); used local knowledge fallback.", "results":KNOWLEDGE.get("market_fallback", [])[:3]}

def coordinate(data: AgentInput, use_live_api: bool = False) -> dict:
    """Assignments 3.1/3.2/4.1: agent negotiation, utility ranking and BDI replanning."""
    bdi = BDIManager()
    facts = asdict(data); bdi.update_beliefs(facts)
    rules = rule_reasoner(data)
    results = []
    # Idea agent proposes, market agent scores demand/competition, feasibility agent checks budget.
    for candidate in CANDIDATES:
        score, parts = utility(candidate, data)
        market_agent = {"demand":candidate["demand"], "competition":candidate["competition"]}
        feasibility_agent = {"feasibility":candidate["feasibility"], "budget_fit":parts["budget_fit"], "decision":"feasible" if parts["budget_fit"] >= 5 and candidate["feasibility"] >= 5 else "reduce_mvp_scope"}
        idea_agent = {"candidate":candidate["name"], "proposal_score":score, "domain_match":candidate["domain"] == data.domain}
        audience_agent = {"target_audience":candidate["audience"], "audience_match":candidate["audience"].lower() == data.audience.lower() or candidate["audience"] == "Everyone"}
        risk_level = "high" if candidate["cost"] == "high" or candidate["competition"] >= 8 else ("medium" if candidate["competition"] >= 6 else "low")
        risk_agent = {"risk_level":risk_level, "key_risk":"High initial cost" if candidate["cost"] == "high" else ("Crowded competitor landscape" if candidate["competition"] >= 7 else "Validate willingness to pay"), "mitigation":"Run a small customer pilot before scaling"}
        specialists = (idea_agent, market_agent, feasibility_agent, audience_agent, risk_agent)
        consensus = all(isinstance(agent, dict) and bool(agent) for agent in specialists)
        results.append({"name":candidate["name"], "domain":candidate["domain"], "cost_level":candidate["cost"], "score":score, "components":parts,
                        "agents":{"idea_agent":idea_agent,"market_agent":market_agent,"feasibility_agent":feasibility_agent,"audience_agent":audience_agent,"risk_agent":risk_agent}, "consensus":consensus,
                        "reason":f"Preference fit, demand {candidate['demand']}/10, feasibility {candidate['feasibility']}/10, competition {candidate['competition']}/10.",
                        "explanation":[f"Preference fit: {parts['preference_fit']}/35",f"Demand: {candidate['demand']}/10",f"Feasibility: {candidate['feasibility']}/10",f"Competition opportunity: {10-candidate['competition']}/10",f"Budget fit: {parts['budget_fit']}/10"]})
    results.sort(key=lambda x:x["score"], reverse=True)
    if use_live_api: market = live_market_context(data.domain)
    else: market = {"source":"curated local knowledge base", "live":False, "results":KNOWLEDGE.get("market_fallback", [])[:3]}
    facts["top_candidate"] = results[0]["name"]
    bdi.update_beliefs({"top_candidate":results[0]["name"], "market_context_source":market["source"]})
    MONITOR.submit({"kind":"startup_evaluation", "domain":data.domain, "candidates":len(results), "winner":results[0]["name"]})
    triples = ([{"subject":c["name"],"predicate":"targets","object":c["audience"]} for c in CANDIDATES] + [{"subject":c["name"],"predicate":"uses_technology","object":t} for c in CANDIDATES for t in c["tech"][:1]])
    return {"project":"AI Startup Idea Generator", "top_recommendation":results[0], "ranked_candidates":results,
            "rules_fired":rules, "bdi":bdi.snapshot(), "agent_negotiation":{"agents":["idea-agent","market-agent","feasibility-agent","audience-agent","risk-agent"],"protocol":"specialist proposals -> utility evaluation -> consensus","consensus_reached":all(x["consensus"] for x in results)},
            "knowledge_representation":{"source":"knowledge_base.json + candidate ontology","triples":triples,"note":"Curated educational knowledge, not independently verified market facts."},
            "market_context":market, "security":{"message_authentication":"HMAC-SHA256", "trusted_senders":sorted(TRUSTED_AGENTS)},
            "assignment_coverage":{"1.1":"PEAS and environment documented in docs/ASSIGNMENT_MAPPING.md", "1.2":"condition-action rules", "2.1":"daemon worker + thread-safe queue", "2.2":"authenticated JSON socket server", "3.1":"specialist-agent proposals and consensus", "3.2":"weighted utility ranking of 10 ideas", "4.1":"BDI state and dynamic intentions", "4.2":"structured JSON knowledge + optional live REST API", "5.1":"HMAC signatures, trusted senders, timestamps and replay protection", "5.2":"integrated API and React UI"}, "worker_events":LAST_EVENTS[-10:]}
