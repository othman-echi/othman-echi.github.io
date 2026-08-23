/****************************************************************
 * CLASS REGISTER — live check-in server
 * ---------------------------------------------------------------
 * SETUP (once, about five minutes)
 *
 *  1. Go to script.google.com  ->  New project.
 *  2. Delete whatever is in Code.gs, paste this whole file, save.
 *  3. Run the function  setup  (choose it in the toolbar, press Run).
 *     Approve the permissions Google asks for. Open View -> Logs:
 *     it prints your TOKEN and the link to the spreadsheet it made.
 *     Copy the TOKEN.
 *  4. Deploy -> New deployment -> type: Web app.
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Deploy, then copy the /exec web app URL.
 *  5. In CLASS_REGISTER.html open the QR check-in tab, paste the URL and
 *     the TOKEN, and press Publish this section.
 *
 *  After changing this file, always Deploy -> Manage deployments ->
 *  edit -> New version, or students keep getting the old code.
 ****************************************************************/

var P = PropertiesService.getScriptProperties();
var SHEETS = {
  sections: ['key', 'name', 'payload', 'updated'],
  live:     ['key', 'date', 'code', 'open'],
  checkins: ['time', 'key', 'date', 'sid', 'name']
};

/* ------------------------- setup ------------------------- */
function setup() {
  var id = P.getProperty('SHEET_ID'), ss;
  if (id) {
    ss = SpreadsheetApp.openById(id);
  } else {
    ss = SpreadsheetApp.create('Class Register — live data');
    P.setProperty('SHEET_ID', ss.getId());
  }
  Object.keys(SHEETS).forEach(function (n) {
    var sh = ss.getSheetByName(n);
    if (!sh) sh = ss.insertSheet(n);
    if (sh.getLastRow() === 0) sh.appendRow(SHEETS[n]);
  });
  var first = ss.getSheetByName('Sheet1');
  if (first && first.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(first);

  var tok = P.getProperty('TOKEN');
  if (!tok) {
    tok = Utilities.getUuid().replace(/-/g, '');
    P.setProperty('TOKEN', tok);
  }
  Logger.log('TOKEN: ' + tok);
  Logger.log('Spreadsheet: ' + ss.getUrl());
  Logger.log('Now deploy this project as a web app (Anyone) and copy the /exec URL.');
  return tok;
}
function resetToken() {
  var tok = Utilities.getUuid().replace(/-/g, '');
  P.setProperty('TOKEN', tok);
  Logger.log('New TOKEN: ' + tok);
  return tok;
}

/* ------------------------- store ------------------------- */
function book() {
  var id = P.getProperty('SHEET_ID');
  if (!id) throw new Error('Run setup() first.');
  return SpreadsheetApp.openById(id);
}
function sheet(name) { return book().getSheetByName(name); }
function rows(name) {
  var sh = sheet(name);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, SHEETS[name].length).getValues();
}
function findRow(name, col, val) {
  var all = rows(name);
  for (var i = 0; i < all.length; i++) if (String(all[i][col]) === String(val)) return { i: i + 2, r: all[i] };
  return null;
}
function checkToken(t) {
  var real = P.getProperty('TOKEN');
  if (!real || String(t) !== String(real)) throw new Error('Wrong token.');
}
function normalizedId(v) { return String(v || '').trim().toLowerCase(); }
function normalizedAccess(v) { return String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
function digestHex(v) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(v || ''), Utilities.Charset.UTF_8)
    .map(function (b) { var n = b < 0 ? b + 256 : b; return ('0' + n.toString(16)).slice(-2); }).join('');
}
function sameSecret(a, b) {
  a = String(a || ''); b = String(b || '');
  if (a.length !== b.length) return false;
  var d = 0; for (var i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
function safeNumber(v) { if (v === null || v === undefined || v === '') return null; var n = Number(v); return isFinite(n) ? n : null; }
function privatePayload(payload) {
  payload = payload || {};
  var out = { name: String(payload.name || ''), students: [], records: {}, warnAt: safeNumber(payload.warnAt), limit: safeNumber(payload.limit) };
  var roster = {};
  (payload.students || []).forEach(function (st) {
    var sid = String(st.sid || '').trim(); if (!sid) return;
    var key = normalizedId(sid); roster[key] = true;
    out.students.push({ sid: sid, name: String(st.name || sid) });
  });
  Object.keys(payload.records || {}).forEach(function (rawKey) {
    var src = payload.records[rawKey] || {}, key = normalizedId(src.sid || rawKey);
    if (!roster[key] || !src.access) return;
    var att = src.attendance || {};
    out.records[key] = {
      name: String(src.name || ''), sid: String(src.sid || ''), codeHash: digestHex(normalizedAccess(src.access)),
      attendance: { held: safeNumber(att.held), present: safeNumber(att.present), late: safeNumber(att.late), excused: safeNumber(att.excused), absent: safeNumber(att.absent), unmarked: safeNumber(att.unmarked), pct: safeNumber(att.pct) },
      scores: (src.scores || []).map(function (score) { return { name: String(score.name || ''), kind: String(score.kind || ''), max: safeNumber(score.max), score: safeNumber(score.score) }; }),
      total: safeNumber(src.total)
    };
  });
  return out;
}
function getSection(key) {
  var f = findRow('sections', 0, key);
  if (!f) return null;
  var s = JSON.parse(f.r[2]);
  s.key = key;
  s.name = f.r[1];
  return s;
}
function getLive(key) {
  var f = findRow('live', 0, key);
  if (!f) return { open: false };
  return { date: String(f.r[1]), code: String(f.r[2] || ''), open: f.r[3] === true || String(f.r[3]).toUpperCase() === 'TRUE' };
}

/* ------------------------- teacher API ------------------------- */
function publish(d) {
  checkToken(d.token);
  var sh = sheet('sections'), f = findRow('sections', 0, d.key);
  var payload = privatePayload(d.payload);
  var row = [d.key, payload.name || d.key, JSON.stringify(payload), new Date()];
  if (f) sh.getRange(f.i, 1, 1, 4).setValues([row]);
  else sh.appendRow(row);
  return { ok: true, students: (d.payload.students || []).length };
}
function openSession(d) {
  checkToken(d.token);
  var sh = sheet('live'), f = findRow('live', 0, d.key);
  var row = [d.key, d.date, String(d.code || ''), true];
  if (f) sh.getRange(f.i, 1, 1, 4).setValues([row]);
  else sh.appendRow(row);
  return { ok: true, date: d.date, code: String(d.code || '') };
}
function closeSession(d) {
  checkToken(d.token);
  var f = findRow('live', 0, d.key);
  if (f) sheet('live').getRange(f.i, 4).setValue(false);
  return { ok: true };
}
function listCheckins(d) {
  checkToken(d.token);
  var out = [];
  rows('checkins').forEach(function (r) {
    if (String(r[1]) !== String(d.key)) return;
    if (d.date && String(r[2]) !== String(d.date)) return;
    out.push({ sid: String(r[3]), name: String(r[4]), time: String(r[0]) });
  });
  return { ok: true, date: d.date || '', checkins: out };
}

/* ------------------------- student API ------------------------- */
function doCheckin(key, sid, code, access) {
  sid = String(sid || '').trim();
  access = String(access || '').trim();
  if (!sid || !access) return { ok: false, msg: 'Enter your student ID and private access code.' };
  var live = getLive(key);
  if (!live.open) return { ok: false, msg: 'Check-in is not open right now.' };
  if (live.code && String(code || '').trim() !== live.code) return { ok: false, msg: 'Wrong class code.' };
  var sec = getSection(key);
  if (!sec) return { ok: false, msg: 'This section is not published yet.' };
  var record = (sec.records || {})[normalizedId(sid)];
  if (!record || !sameSecret(record.codeHash, digestHex(normalizedAccess(access)))) return { ok: false, msg: 'The student ID or private access code is not valid.' };
  var me = null;
  (sec.students || []).forEach(function (s) { if (String(s.sid).toLowerCase() === sid.toLowerCase()) me = s; });
  if (!me) return { ok: false, msg: 'That ID is not on this section roster.' };

  var lock = LockService.getScriptLock();
  try { lock.waitLock(8000); } catch (e) { return { ok: false, msg: 'Server busy, try again.' }; }
  try {
    var dup = false;
    rows('checkins').forEach(function (r) {
      if (String(r[1]) === String(key) && String(r[2]) === String(live.date) && String(r[3]).toLowerCase() === sid.toLowerCase()) dup = true;
    });
    if (dup) return { ok: true, dup: true, name: me.name, msg: 'You are already checked in.' };
    sheet('checkins').appendRow([new Date(), key, live.date, me.sid, me.name]);
  } finally { lock.releaseLock(); }
  return { ok: true, name: me.name, msg: 'Checked in.' };
}
function myRecord(key, sid, access) {
  sid = String(sid || '').trim();
  access = String(access || '').trim();
  var denied = { ok: false, msg: 'The student ID or private access code is not valid.' };
  if (!sid || !access) return denied;
  var cache = CacheService.getScriptCache(), attemptKey = 'record-' + digestHex(String(key) + '|' + normalizedId(sid)).slice(0, 36);
  var attempts = Number(cache.get(attemptKey) || 0);
  if (attempts >= 8) return { ok: false, msg: 'Too many attempts. Wait five minutes and try again.' };
  cache.put(attemptKey, String(attempts + 1), 300);
  var sec = getSection(key), rec = sec && (sec.records || {})[normalizedId(sid)];
  if (!rec || !sameSecret(rec.codeHash, digestHex(normalizedAccess(access)))) return denied;
  cache.remove(attemptKey);
  var clean = JSON.parse(JSON.stringify(rec)); delete clean.codeHash;
  return { ok: true, section: sec.name, warnAt: sec.warnAt, limit: sec.limit, me: clean };
}

/* ------------------------- routing ------------------------- */
function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
function doGet(e) {
  var q = (e && e.parameter) || {};
  try {
    if (q.page === 'checkin') return page(checkinPage(q.s || ''), 'Check in');
    if (q.page === 'me') return page(mePage(q.s || ''), 'Student records');
    return page('<div class="w"><h1>Class Register</h1><p class="sub">Nothing to see here. Use the link your instructor gave you.</p></div>', 'Class Register');
  } catch (err) {
    return json({ ok: false, msg: String(err.message || err) });
  }
}
function doPost(e) {
  var d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, msg: 'Bad request body.' }); }
  try {
    if (d.action === 'publish') return json(publish(d));
    if (d.action === 'open') return json(openSession(d));
    if (d.action === 'close') return json(closeSession(d));
    if (d.action === 'checkins') return json(listCheckins(d));
    if (d.action === 'checkin') return json(doCheckin(d.key, d.sid, d.code, d.access));
    if (d.action === 'me') return json(myRecord(d.key, d.sid, d.access));
    return json({ ok: false, msg: 'Unknown action.' });
  } catch (err) {
    return json({ ok: false, msg: String(err.message || err) });
  }
}

/* ------------------------- student pages ------------------------- */
function page(body, title) {
  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + title + '</title><style>' + css() + '</style></head><body>' + body + '</body></html>'
  ).addMetaTag('viewport', 'width=device-width, initial-scale=1').setTitle(title);
}
function css() {
  return "body{margin:0;background:#E9EDF1;color:#14212E;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:22px 14px}" +
    ".w{max-width:560px;margin:0 auto;background:#fff;border:1px solid #D3DBE3;border-radius:10px;padding:22px}" +
    "h1{font-family:Georgia,serif;font-size:21px;margin:0 0 2px}" +
    ".sub{color:#8496A6;font-size:13px;margin:0 0 16px}" +
    "input{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:20px;padding:11px;border:1px solid #B7C3CD;border-radius:6px;width:100%;text-align:center;letter-spacing:.08em;box-sizing:border-box;margin-bottom:9px}" +
    "button{background:#0F5A6E;color:#fff;border:none;border-radius:6px;padding:13px;font-size:16px;cursor:pointer;width:100%}" +
    "table{border-collapse:collapse;width:100%;font-size:14px;margin-top:6px}" +
    "th,td{border-bottom:1px solid #D3DBE3;padding:7px 8px;text-align:left}" +
    "th{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#8496A6;background:#F5F8FA}" +
    "td.n,th.n{text-align:right;font-family:ui-monospace,Menlo,Consolas,monospace}" +
    "tr.tot td{border-top:2px solid #B7C3CD;font-weight:700}" +
    ".stats{display:flex;gap:18px;flex-wrap:wrap;margin:12px 0}" +
    ".stat b{display:block;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:19px}" +
    ".stat span{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#8496A6}" +
    "h3{font-family:Georgia,serif;font-size:15px;margin:18px 0 4px;border-top:1px solid #D3DBE3;padding-top:14px}" +
    ".msg{margin-top:14px;padding:11px;border-radius:6px;font-size:15px}" +
    ".good{background:#E4F2EA;color:#1E7A4B}.bad{background:#F7E3E2;color:#B02A28}";
}
function checkinPage(key) {
  var live = getLive(key), sec = getSection(key);
  var head = '<div class="w"><h1>Check in</h1><p class="sub">' + (sec ? esc_(sec.name) : 'Class Register') + '</p>';
  if (!live.open) return head + '<div class="msg bad">Check-in is closed right now.</div></div>';
  var codeBox = live.code ? '<input id="code" inputmode="numeric" placeholder="Class code">' : '';
  return head +
    '<input id="sid" inputmode="numeric" placeholder="Student ID" autocomplete="off">' +
    '<input id="access" type="password" placeholder="Private access code" autocomplete="one-time-code">' + codeBox +
    '<button id="go">Check in</button><div id="out"></div>' +
    '<script>' +
    'var b=document.getElementById("go");' +
    'function done(r){b.disabled=false;b.textContent="Check in";' +
    ' document.getElementById("out").innerHTML=\'<div class="msg \'+(r.ok?"good":"bad")+\'">\'+r.msg+(r.name?" — "+r.name:"")+\'</div>\';}' +
    'b.onclick=function(){b.disabled=true;b.textContent="Sending…";' +
    ' var c=document.getElementById("code");' +
    ' google.script.run.withSuccessHandler(done).withFailureHandler(function(e){done({ok:false,msg:"Network problem, try again."});})' +
    '  .doCheckin("' + key + '",document.getElementById("sid").value,c?c.value:"",document.getElementById("access").value);};' +
    'document.getElementById("sid").addEventListener("keydown",function(e){if(e.key==="Enter")b.click();});' +
    '<\/script></div>';
}
function mePage(key) {
  return '<div class="w"><h1>My private class record</h1><p class="sub">Enter the student ID and private access code supplied by your instructor. Only the matching student record is returned.</p>' +
    '<input id="sid" inputmode="numeric" placeholder="Student ID" autocomplete="off">' +
    '<input id="access" type="password" placeholder="Private access code" autocomplete="one-time-code">' +
    '<button id="go">Show my record</button><div id="out"></div>' +
    '<script>' +
    'function esc(s){return String(s==null?"":s).replace(/[&<>\"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","\\\"":"&quot;"}[c];});}' +
    'function n(v,s){return v==null?"\\u2014":(Math.round(Number(v)*(s?100:10))/(s?100:10)).toString();}' +
    'var b=document.getElementById("go");' +
    'function show(d){b.disabled=false;b.textContent="Show my record";var o=document.getElementById("out");' +
    ' if(!d.ok){o.innerHTML=\'<div class="msg bad">\'+esc(d.msg)+\'</div>\';return;}' +
    ' var p=d.me,a=p.attendance||{},h=\'<h3>\'+esc(p.name)+\'</h3><p class="sub">\'+esc(d.section)+\' · \'+esc(p.sid)+\'</p><div class="stats">\';' +
    ' h+=\'<div class="stat"><b>\'+(a.pct==null?"\\u2014":n(a.pct)+"%")+\'</b><span>attendance</span></div>\';' +
    ' h+=\'<div class="stat"><b>\'+n(a.absent)+\'</b><span>absences</span></div><div class="stat"><b>\'+n(a.late)+\'</b><span>late</span></div><div class="stat"><b>\'+n(a.held)+\'</b><span>sessions</span></div></div>\';' +
    ' if(d.limit!=null&&a.absent>=d.limit)h+=\'<div class="msg bad">You have reached the course absence limit.</div>\';else if(d.warnAt!=null&&a.absent>=d.warnAt)h+=\'<div class="msg bad">Attendance warning: please contact your instructor.</div>\';' +
    ' if(p.scores&&p.scores.length){h+=\'<h3>My scores</h3><table><thead><tr><th>Assessment</th><th class="n">Score</th><th class="n">Out of</th></tr></thead><tbody>\';' +
    '  p.scores.forEach(function(x){h+=\'<tr><td>\'+esc(x.name)+\'</td><td class="n"><b>\'+n(x.score,1)+\'</b></td><td class="n">\'+n(x.max,1)+\'</td></tr>\';});' +
    '  h+=\'<tr class="tot"><td>Total</td><td class="n">\'+(p.total==null?"\\u2014":n(p.total)+"%")+\'</td><td class="n">100</td></tr></tbody></table>\';}' +
    ' o.innerHTML=h;}' +
    'b.onclick=function(){b.disabled=true;b.textContent="Verifying…";google.script.run.withSuccessHandler(show).withFailureHandler(function(){show({ok:false,msg:"Network problem, try again."});}).myRecord("' + key + '",document.getElementById("sid").value,document.getElementById("access").value);};' +
    'document.getElementById("access").addEventListener("keydown",function(e){if(e.key==="Enter")b.click();});' +
    '<\/script></div>';
}
function esc_(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}
