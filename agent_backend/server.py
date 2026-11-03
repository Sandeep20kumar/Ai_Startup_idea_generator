"""HTTP API for the React AI Startup Idea Generator. Run: python server.py"""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json, os, threading, urllib.parse
from dataclasses import fields
from agent_core import AgentInput, coordinate, verify_message, signed_message, agent_socket_server, LAST_EVENTS, MONITOR

HOST = os.environ.get("AGENT_HOST", "127.0.0.1")
PORT = int(os.environ.get("AGENT_PORT", "8000"))
class Handler(BaseHTTPRequestHandler):
    def _send(self, status, obj):
        raw = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(status); self.send_header("Content-Type","application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin","http://localhost:5173"); self.send_header("Access-Control-Allow-Methods","GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers","Content-Type"); self.send_header("Content-Length",str(len(raw))); self.end_headers(); self.wfile.write(raw)
    def do_OPTIONS(self): self._send(200,{"ok":True})
    def do_GET(self):
        if self.path.startswith("/api/status"):
            self._send(200,{"status":"running","project":"AI Startup Idea Generator","workers":1,"agents":["idea-agent","market-agent","feasibility-agent","audience-agent","risk-agent","bdi-coordinator"],"recent_events":LAST_EVENTS[-10:]})
        else: self._send(404,{"error":"Not found"})
    def do_POST(self):
        try: data=json.loads(self.rfile.read(int(self.headers.get("Content-Length","0"))).decode() or "{}")
        except Exception: self._send(400,{"error":"Request body must be valid JSON"}); return
        if self.path in ("/api/generate", "/api/replan"):
            allowed={f.name for f in fields(AgentInput)}
            cleaned={k:str(v).strip()[:200] for k,v in data.items() if k in allowed and isinstance(v,(str,int,float))}
            try:
                current=AgentInput(**cleaned)
                result=coordinate(current, bool(data.get("use_live_api",False)))
                if self.path == "/api/replan":
                    previous=data.get("previous", {}) if isinstance(data.get("previous", {}),dict) else {}
                    changes=[{"field":k,"from":str(previous.get(k,"(not set)")),"to":str(getattr(current,k))} for k in allowed if previous.get(k) != getattr(current,k)]
                    result["replanning"]={"triggered":bool(changes),"changes":changes,"reason":"Requirements changed; beliefs and utility ranking were recalculated." if changes else "No input changes detected; ranking recalculated."}
                self._send(200,result)
            except (TypeError,ValueError) as exc: self._send(400,{"error":"Invalid agent input","detail":str(exc)})
            except Exception as exc: self._send(500,{"error":"Agent evaluation failed","detail":str(exc)})
        elif self.path == "/api/security/test":
            good=signed_message("idea-agent",{"action":"evaluate_startup","domain":"Education"}); valid=verify_message(good)
            tampered=dict(good); tampered["payload"]={"action":"delete_all_reports"}; invalid=verify_message(tampered)
            unknown=signed_message("unknown-agent",{"action":"evaluate_startup"}); rejected=verify_message(unknown)
            self._send(200,{"valid_message":{"accepted":valid[0],"message":valid[1]},"tampered_message":{"accepted":invalid[0],"message":invalid[1]},"unknown_sender":{"accepted":rejected[0],"message":rejected[1]}})
        else: self._send(404,{"error":"Not found"})
    def log_message(self, fmt, *args): print("[http]",fmt % args)
if __name__ == "__main__":
    socket_thread=threading.Thread(target=agent_socket_server,daemon=True); socket_thread.start()
    print(f"AI Startup Idea Generator agent API running at http://{HOST}:{PORT}")
    print("Socket agent endpoint: 127.0.0.1:8765 | Ctrl+C to stop")
    ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
