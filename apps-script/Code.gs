// Combinatorics-LSM1. Private state stays in this Apps Script project's properties.
const COURSE_ = {
  folder: '1UjDDTHxBOWgyOfvKD9Ov06tSq1WuuK6s',
  title: 'Combinatorics-LSM1',
  maxFiles: 300,
  maxSubscribers: 250,
  confirmationLimit: 20
};

function properties_() { return PropertiesService.getScriptProperties(); }
function folderUrl_() { return 'https://drive.google.com/drive/folders/' + COURSE_.folder; }
function escape_(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function digest_(s) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s).map(b => ('0' + (b & 255).toString(16)).slice(-2)).join(''); }
function token_() { return Utilities.getUuid() + Utilities.getUuid(); }
function read_(key, fallback) { const v = properties_().getProperty(key); return v ? JSON.parse(v) : fallback; }
function write_(key, value) { properties_().setProperty(key, JSON.stringify(value)); }
function locked_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

// Run once from the editor after deploying the web app. Never callable by visitors.
function initializeCourse() {
  const active = Session.getActiveUser().getEmail();
  if (!active || active !== Session.getEffectiveUser().getEmail()) throw new Error('Owner only.');
  if (!ScriptApp.getService().getUrl()) throw new Error('Deploy the web app first.');
  poll_(); // First scan establishes a baseline and sends no alert.
  if (!ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'poll_')) {
    ScriptApp.newTrigger('poll_').timeBased().everyHours(1).create();
  }
}

// Only publicly shared files are exposed. Shortcuts are excluded deliberately.
function scan_() {
  const result = {}, visited = {};
  function visit(folder) {
    if (visited[folder.getId()]) return;
    visited[folder.getId()] = true;
    const files = folder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      if (file.getMimeType() === 'application/vnd.google-apps.shortcut') continue;
      const access = file.getSharingAccess();
      if (access !== DriveApp.Access.ANYONE && access !== DriveApp.Access.ANYONE_WITH_LINK) continue;
      result[file.getId()] = {name: file.getName().slice(0,250), modified: file.getLastUpdated().toISOString()};
      if (Object.keys(result).length > COURSE_.maxFiles) throw new Error('Course folder exceeds the configured file limit.');
    }
    const folders = folder.getFolders();
    while (folders.hasNext()) visit(folders.next());
  }
  visit(DriveApp.getFolderById(COURSE_.folder));
  return result;
}

function poll_() {
  locked_(() => {
    const current = scan_(); // A failed scan never replaces a valid snapshot.
    const props = properties_(), all = props.getProperties();
    const state = read_('state', null);
    const changes = [];
    Object.keys(current).forEach(id => {
      const before = all['file:' + id] ? JSON.parse(all['file:' + id]) : null;
      if (!before || before.modified !== current[id].modified || before.name !== current[id].name) {
        changes.push({id: id, name: current[id].name, kind: before ? 'Updated' : 'New'});
      }
    });
    const now = new Date().toISOString();
    const next = state || {revision: 0, latest: null, recent: []};
    if (state && changes.length) {
      next.revision++;
      next.latest = now;
      next.recent = changes.slice(0, 8).map(c => Object.assign(c, {date: now}));
    }
    // Remove stale public names when a file is deleted or made private.
    next.recent = next.recent.filter(c => !!current[c.id]);
    next.checked = now;
    next.files = Object.keys(current).length;
    const values = {};
    Object.keys(current).forEach(id => { values['file:' + id] = JSON.stringify(current[id]); });
    props.setProperties(values);
    Object.keys(all).filter(k => k.indexOf('file:') === 0 && !current[k.slice(5)]).forEach(k => props.deleteProperty(k));
    write_('state', next);
    let quota = Math.max(0, MailApp.getRemainingDailyQuota() - 10);
    Object.keys(all).filter(k => k.indexOf('sub:') === 0).forEach(key => {
      const sub = JSON.parse(all[key]);
      if (!sub.active && Date.now() - sub.created > 86400000) { props.deleteProperty(key); return; }
      if (!sub.active || sub.revision >= next.revision || quota <= 0) return;
      const unsubscribe = ScriptApp.getService().getUrl() + '?action=unsubscribe&token=' + encodeURIComponent(sub.token);
      MailApp.sendEmail({to: sub.email, subject: COURSE_.title + ' — nouveaux documents / updated materials',
        body: 'Les ressources du cours ont été mises à jour. / Course materials have been updated.\n\nConsulter le dossier / Open the folder:\n' + folderUrl_() + '\n\nDernière détection / Last detected: ' + next.latest + '\n\nSe désabonner / Unsubscribe:\n' + unsubscribe,
        name: COURSE_.title});
      sub.revision = next.revision;
      write_(key, sub);
      quota--;
    });
  });
}

function subscribe(email, website) {
  const message = 'Si la demande peut être acceptée, un courriel vous permettra de confirmer votre inscription. / If accepted, check your email to confirm.';
  if (website) return message;
  email = String(email || '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Saisissez une adresse courriel valide. / Enter a valid email address.');
  return locked_(() => {
    const props = properties_(), key = 'sub:' + digest_(email), existing = read_(key, null);
    if (existing && (existing.active || Date.now() - existing.created < 86400000)) return message;
    const state = read_('state', null);
    if (!state) throw new Error('Les inscriptions ne sont pas encore ouvertes. / Subscriptions are not open yet.');
    const all = props.getProperties();
    Object.keys(all).filter(k => k.indexOf('sub:') === 0).forEach(k => {
      const s = JSON.parse(all[k]);
      if (!s.active && Date.now() - s.created > 86400000) props.deleteProperty(k);
    });
    const total = Object.keys(props.getProperties()).filter(k => k.indexOf('sub:') === 0).length;
    const day = new Date().toISOString().slice(0,10), counter = read_('confirmations', {day: day, count: 0});
    if (counter.day !== day) { counter.day = day; counter.count = 0; }
    if (total >= COURSE_.maxSubscribers || counter.count >= COURSE_.confirmationLimit || MailApp.getRemainingDailyQuota() < 1) throw new Error('Inscriptions temporairement indisponibles. Réessayez demain. / Please try again tomorrow.');
    const sub = {email: email, token: token_(), active: false, created: Date.now(), revision: state.revision};
    write_(key, sub);
    counter.count++;
    write_('confirmations', counter);
    const url = ScriptApp.getService().getUrl() + '?action=confirm&token=' + encodeURIComponent(sub.token);
    try {
      MailApp.sendEmail({to: email, subject: COURSE_.title + ' — confirmer votre inscription / confirm subscription',
        body: 'Vous avez demandé les alertes du cours. Confirmez sous 24 heures :\nYou requested course alerts. Confirm within 24 hours:\n\n' + url + '\n\nSans confirmation, aucun abonnement ne sera activé. Si vous n’avez rien demandé, ignorez ce message. / If you did not request this, ignore this message.', name: COURSE_.title});
    } catch (error) { props.deleteProperty(key); throw new Error('Envoi impossible pour le moment. Réessayez plus tard. / Please try again later.'); }
    return message;
  });
}

// Token actions require an explicit click; email link scanners cannot subscribe/unsubscribe.
function applySubscription(action, token) {
  if (!['confirm','unsubscribe'].includes(action) || !/^[a-f0-9-]{72}$/.test(String(token))) throw new Error('Lien invalide. / Invalid link.');
  return locked_(() => {
    const all = properties_().getProperties();
    const key = Object.keys(all).find(k => k.indexOf('sub:') === 0 && JSON.parse(all[k]).token === token);
    if (!key) return 'Lien expiré ou inscription déjà supprimée. / Link expired or subscription already removed.';
    const sub = JSON.parse(all[key]);
    if (action === 'unsubscribe') { properties_().deleteProperty(key); return 'Votre inscription a été supprimée. / You have been unsubscribed.'; }
    if (!sub.active && Date.now() - sub.created > 86400000) { properties_().deleteProperty(key); return 'Lien expiré. Veuillez vous réinscrire. / Please subscribe again.'; }
    sub.active = true;
    sub.revision = read_('state', {revision: 0}).revision;
    write_(key, sub);
    return 'Inscription confirmée. Vous recevrez les prochaines mises à jour. / Confirmed. You will receive future updates.';
  });
}

function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Widget');
  template.state = read_('state', null);
  template.action = ['confirm','unsubscribe'].includes(e.parameter.action) ? e.parameter.action : '';
  template.token = /^[a-f0-9-]{72}$/.test(String(e.parameter.token || '')) ? e.parameter.token : '';
  template.url = ScriptApp.getService().getUrl();
  template.folderUrl = folderUrl_();
  return template.evaluate().setTitle(COURSE_.title + ' — Updates').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
