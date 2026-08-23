# -*- coding: utf-8 -*-
"""
CLASS REGISTER - local check-in server (no internet needed)
===========================================================
Students check in from their phones over your Wi-Fi or your phone's
hotspot. Nothing leaves the room; nothing is installed.

HOW TO USE
  1. Put this file in a folder together with the PRIVATE access-code CSV
     exported from CLASS_REGISTER.html
     (Roster tab -> Export private access codes).
  2. Double-click START_CHECKIN.bat  (or run:  py CHECKIN_LOCAL.py)
  3. Windows may ask to allow Python through the firewall.
     Tick PRIVATE networks and allow it. This happens once.
  4. The window prints an address like  http://192.168.43.1:8000
     and a 4-digit CODE. Write both on the board.
  5. Students open the address, type their ID, their private access code,
     and the class code.
     Each check-in appears in this window as it happens.
  6. Press Ctrl+C to stop. The folder now holds
     checkins-YYYY-MM-DD.json  ->  import it in the app's Live tab.

NO WI-FI IN THE ROOM? Turn on your phone's hotspot with mobile data
OFF, connect the laptop to it, and run this. It costs nothing and
university client-isolation settings cannot interfere.

Needs Python 3.7+ from python.org (tick "Add Python to PATH").
"""

import csv
import datetime
import hashlib
import hmac
import html
import http.server
import ipaddress
import json
import os
import random
import socket
import socketserver
import sys
import urllib.parse

# ------------------------------------------------------------------ config
PORT = 8000            # change if something else uses this port
CODE = ""              # leave "" for a random 4-digit code each run
DATE = ""              # leave "" for today
ONE_PER_DEVICE = True  # flag several check-ins from the same phone
HERE = os.path.dirname(os.path.abspath(sys.argv[0] if getattr(sys, "frozen", False) else __file__))

roster = {}        # lowercase id -> name
access_codes = {}  # lowercase id -> SHA-256 digest of normalized private code
records = {}       # lowercase id -> dict
session_date = DATE or datetime.date.today().isoformat()
code = CODE or str(random.randint(1000, 9999))


# ------------------------------------------------------------------ roster
def find_roster():
    names = [f for f in os.listdir(HERE) if f.lower().endswith(".csv")]
    if not names:
        return None
    exact = [f for f in names if "private-access-codes" in f.lower()]
    return os.path.join(HERE, exact[0]) if exact else None


def normalize_access(value):
    return "".join(ch for ch in (value or "").upper() if ch.isalnum())


def access_digest(value):
    return hashlib.sha256(normalize_access(value).encode("utf-8")).digest()


def load_roster():
    path = find_roster()
    if not path:
        print("  STOPPED: no *-PRIVATE-access-codes.csv file was found.")
        print("  In the app, open Roster and choose Export private access codes.")
        print("  Put that confidential CSV beside this file, then start again.\n")
        return False
    with open(path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        headers = {str(h or "").strip().lower(): h for h in (reader.fieldnames or [])}
        id_col = headers.get("id")
        name_col = headers.get("name")
        access_col = headers.get("private access code")
        if not id_col or not name_col or not access_col:
            print("  STOPPED: the private access-code CSV has unexpected columns.")
            print("  Export a fresh copy from the app's Roster tab.\n")
            return False
        for row in reader:
            sid = str(row.get(id_col) or "").strip()
            name = str(row.get(name_col) or "").strip()
            private_code = normalize_access(str(row.get(access_col) or ""))
            if not sid or not name or len(private_code) < 12:
                continue
            key = sid.lower()
            roster[key] = name
            access_codes[key] = access_digest(private_code)
    if not roster:
        print("  STOPPED: the private access-code CSV contains no usable students.\n")
        return False
    print("  Private roster: %s  (%d students)\n" % (os.path.basename(path), len(roster)))
    return True


def save():
    payload = {
        "date": session_date,
        "checkins": [
            {"sid": r["sid"], "name": r["name"], "time": r["time"]}
            for r in records.values()
        ],
    }
    base = os.path.join(HERE, "checkins-" + session_date)
    with open(base + ".json", "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=1)
    with open(base + ".csv", "w", newline="", encoding="utf-8-sig") as fh:
        w = csv.writer(fh)
        w.writerow(["ID", "Name", "Time", "Device"])
        for r in records.values():
            w.writerow([r["sid"], r["name"], r["time"], r["ip"]])


# ------------------------------------------------------------------ pages
CSS = """
body{margin:0;background:#E9EDF1;color:#14212E;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:26px 14px}
.w{max-width:460px;margin:0 auto;background:#fff;border:1px solid #D3DBE3;border-radius:10px;padding:22px}
h1{font-family:Georgia,serif;font-size:22px;margin:0 0 2px}
.sub{color:#8496A6;font-size:13px;margin:0 0 18px}
input{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:20px;padding:12px;border:1px solid #B7C3CD;
 border-radius:6px;width:100%;text-align:center;letter-spacing:.08em;box-sizing:border-box;margin-bottom:10px}
button{background:#0F5A6E;color:#fff;border:none;border-radius:6px;padding:14px;font-size:16px;width:100%;cursor:pointer}
.msg{margin-top:16px;padding:12px;border-radius:6px;font-size:15px}
.good{background:#E4F2EA;color:#1E7A4B}.bad{background:#F7E3E2;color:#B02A28}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{border-bottom:1px solid #D3DBE3;padding:6px 8px;text-align:left}
th{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:#8496A6;background:#F5F8FA}
.mono{font-family:ui-monospace,Menlo,Consolas,monospace}
"""

FORM = """<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Check in</title>
<style>%s</style></head><body><div class="w">
<h1>Check in</h1><p class="sub">%s &middot; %s</p>
<input id="sid" inputmode="numeric" placeholder="Student ID" autocomplete="off">
<input id="access" type="password" placeholder="Private access code" autocomplete="off">
<input id="code" inputmode="numeric" placeholder="Class code" autocomplete="off">
<button id="go">Check in</button><div id="out"></div>
<script>
var b=document.getElementById("go");
function done(r){b.disabled=false;b.textContent="Check in";
 document.getElementById("out").innerHTML='<div class="msg '+(r.ok?"good":"bad")+'">'+r.msg+'</div>';}
b.onclick=function(){b.disabled=true;b.textContent="Sending...";
 var d="sid="+encodeURIComponent(document.getElementById("sid").value)+
       "&access="+encodeURIComponent(document.getElementById("access").value)+
       "&code="+encodeURIComponent(document.getElementById("code").value);
 var x=new XMLHttpRequest();x.open("POST","/checkin",true);
 x.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
 x.onload=function(){try{done(JSON.parse(x.responseText));}catch(e){done({ok:false,msg:"Try again."});}};
 x.onerror=function(){done({ok:false,msg:"No connection to the classroom network."});};
 x.send(d);};
document.getElementById("code").addEventListener("keydown",function(e){if(e.key==="Enter")b.click();});
</script></div></body></html>"""


def list_page():
    seen = {}
    for r in records.values():
        seen.setdefault(r["ip"], []).append(r["sid"])
    rows = ""
    for r in sorted(records.values(), key=lambda x: x["time"]):
        flag = " &nbsp;<b>same device</b>" if ONE_PER_DEVICE and len(seen.get(r["ip"], [])) > 1 else ""
        rows += "<tr><td class='mono'>%s</td><td>%s</td><td class='mono'>%s%s</td></tr>" % (
            html.escape(r["sid"]), html.escape(r["name"]), html.escape(r["time"]), flag)
    return ("<!DOCTYPE html><html><head><meta charset='utf-8'><title>Check-ins</title>"
            "<style>%s</style></head><body><div class='w' style='max-width:620px'>"
            "<h1>%d checked in</h1><p class='sub'>%s &middot; refresh to update</p>"
            "<table><thead><tr><th>ID</th><th>Name</th><th>Time</th></tr></thead>"
            "<tbody>%s</tbody></table></div></body></html>") % (CSS, len(records), session_date, rows)


# ------------------------------------------------------------------ server
class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send(self, body, ctype="text/html; charset=utf-8", status=200):
        raw = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path
        if path in ("/", "/index.html"):
            self.send(FORM % (CSS, "Attendance", session_date))
        elif path == "/list":
            if is_local_client(self.client_address[0]):
                self.send(list_page())
            else:
                self.send("<p>Instructor access only.</p>", status=403)
        elif path == "/data":
            if is_local_client(self.client_address[0]):
                payload = {"date": session_date,
                           "checkins": [{"sid": r["sid"], "name": r["name"], "time": r["time"]}
                                        for r in records.values()]}
                self.send(json.dumps(payload, ensure_ascii=False), "application/json; charset=utf-8")
            else:
                self.send('{"error":"Instructor access only."}', "application/json; charset=utf-8", 403)
        else:
            self.send("<p>Not here.</p>", status=404)

    def do_POST(self):
        if urllib.parse.urlparse(self.path).path != "/checkin":
            self.send('{"ok":false,"msg":"Not here."}', "application/json; charset=utf-8", 404)
            return
        length = int(self.headers.get("Content-Length") or 0)
        body = self.rfile.read(length).decode("utf-8", "replace")
        form = urllib.parse.parse_qs(body)
        sid = (form.get("sid", [""])[0] or "").strip()
        given = (form.get("code", [""])[0] or "").strip()
        private_code = (form.get("access", [""])[0] or "").strip()
        ip = self.client_address[0]
        self.send(json.dumps(check_in(sid, given, private_code, ip), ensure_ascii=False),
                  "application/json; charset=utf-8")


def check_in(sid, given, private_code, ip):
    key = sid.lower()
    supplied = access_digest(private_code)
    expected = access_codes.get(key, b"\x00" * 32)
    valid_identity = bool(sid and private_code and key in roster and hmac.compare_digest(supplied, expected))
    if not valid_identity or not hmac.compare_digest(given, code):
        return {"ok": False, "msg": "Check your student ID, private access code, and class code."}
    name = roster[key]
    if key in records:
        return {"ok": True, "msg": "You are already checked in, " + name + "."}
    now = datetime.datetime.now().strftime("%H:%M:%S")
    records[key] = {"sid": sid, "name": name, "time": now, "ip": ip}
    save()
    dupe = ""
    if ONE_PER_DEVICE and sum(1 for r in records.values() if r["ip"] == ip) > 1:
        dupe = "   <-- same device as an earlier check-in"
    print("  %s  %-12s %s%s" % (now, sid, name, dupe))
    return {"ok": True, "msg": "Checked in - " + name}


def is_local_client(value):
    try:
        address = ipaddress.ip_address(value)
        if address.is_loopback:
            return True
        return bool(address.version == 6 and address.ipv4_mapped and address.ipv4_mapped.is_loopback)
    except ValueError:
        return False


def my_ips():
    found = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        found.append(s.getsockname()[0])
        s.close()
    except Exception:
        pass
    try:
        for info in socket.getaddrinfo(socket.gethostname(), None, socket.AF_INET):
            ip = info[4][0]
            if not ip.startswith("127.") and ip not in found:
                found.append(ip)
    except Exception:
        pass
    return found or ["127.0.0.1"]


def main():
    print("")
    print("  CLASS REGISTER - local check-in")
    print("  " + "-" * 46)
    if not load_roster():
        input("  Press Enter to close.")
        return
    ips = my_ips()
    print("  Students open:")
    for ip in ips:
        print("      http://%s:%d" % (ip, PORT))
    print("")
    print("  CLASS CODE:  %s" % code)
    print("  Date:        %s" % session_date)
    print("")
    print("  Your own view of the list:  http://localhost:%d/list" % PORT)
    print("  Saving to: checkins-%s.json  (import it in the Live tab)" % session_date)
    print("  " + "-" * 46)
    print("  Ctrl+C to stop.\n")
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    try:
        srv = socketserver.ThreadingTCPServer(("0.0.0.0", PORT), Handler)
    except OSError as e:
        print("  Could not start on port %d (%s)." % (PORT, e))
        print("  Edit PORT near the top of this file and try again.")
        input("\n  Press Enter to close.")
        return
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.server_close()
        save()
        print("\n  Stopped. %d check-in(s) saved to checkins-%s.json" % (len(records), session_date))
        input("  Press Enter to close.")


if __name__ == "__main__":
    main()
