const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
let data = {}, sent = [], quota = 100, active = 'owner@example.org', files = [], failScan = false;
const iterator = items => { let i = 0; return {hasNext:()=>i<items.length, next:()=>items[i++]}; };
const file = (id, date='2026-01-01', access='ANYONE_WITH_LINK') => ({getId:()=>id,getName:()=>id+'.pdf',getMimeType:()=> 'application/pdf',getSharingAccess:()=>access,getLastUpdated:()=>new Date(date)});
const folder = {getId:()=> 'course',getFiles:()=>{if(failScan)throw Error('Drive down');return iterator(files);},getFolders:()=>iterator([])};
const context = vm.createContext({
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>data[k]??null,setProperty:(k,v)=>{data[k]=v;},deleteProperty:k=>{delete data[k];},getProperties:()=>({...data}),setProperties:values=>Object.assign(data,values)})},
  LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
  Utilities:{DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(a,s)=>Array.from(crypto.createHash(a).update(s).digest()),getUuid:()=>crypto.randomUUID()},
  DriveApp:{Access:{ANYONE:'ANYONE',ANYONE_WITH_LINK:'ANYONE_WITH_LINK'},getFolderById:()=>folder},
  MailApp:{getRemainingDailyQuota:()=>quota,sendEmail:m=>{sent.push(m);quota--; }},
  Session:{getActiveUser:()=>({getEmail:()=>active}),getEffectiveUser:()=>({getEmail:()=> 'owner@example.org'})},
  ScriptApp:{getService:()=>({getUrl:()=> 'https://script.google.com/macros/s/test/exec'}),getProjectTriggers:()=>[{getHandlerFunction:()=> 'poll_'}]},
  console
});
vm.runInContext(fs.readFileSync(__dirname+'/Code.gs','utf8'),context);
const state=()=>JSON.parse(data.state);
const subscriber=()=>JSON.parse(data[Object.keys(data).find(k=>k.startsWith('sub:'))]);
files=[file('first'),file('private','2026-01-01','PRIVATE')];
context.initializeCourse();
assert.equal(state().files,1);assert.equal(state().revision,0);assert.equal(sent.length,0);
assert.ok(!data['file:private']);
active='';assert.throws(()=>context.initializeCourse(),/Owner only/);active='owner@example.org';
context.subscribe('student@example.org','');
assert.equal(sent.length,1);assert.equal(subscriber().active,false);
context.subscribe('student@example.org','');assert.equal(sent.length,1);
const token=subscriber().token;
assert.match(context.applySubscription('confirm',token),/Confirmed/);
assert.equal(subscriber().active,true);
context.poll_();assert.equal(sent.length,1);
files.push(file('second'));context.poll_();assert.equal(sent.length,2);assert.equal(state().revision,1);
context.poll_();assert.equal(sent.length,2);
files=[file('first','2026-02-01'),file('second')];quota=10;context.poll_();assert.equal(sent.length,2);
assert.equal(subscriber().revision,1);quota=100;context.poll_();assert.equal(sent.length,3);assert.equal(subscriber().revision,2);
const before=data.state;failScan=true;assert.throws(()=>context.poll_(),/Drive down/);assert.equal(data.state,before);failScan=false;
context.applySubscription('unsubscribe',token);assert.ok(!Object.keys(data).some(k=>k.startsWith('sub:')));
files.push(file('third'));context.poll_();assert.equal(sent.length,3);
assert.throws(()=>context.subscribe('invalid',''),/valide/);
context.subscribe('bot@example.org','filled');assert.equal(sent.length,3);
context.subscribe('expire@example.org','');const key=Object.keys(data).find(k=>k.startsWith('sub:'));
const expired=JSON.parse(data[key]);expired.created=Date.now()-86400001;data[key]=JSON.stringify(expired);
assert.match(context.applySubscription('confirm',expired.token),/expiré/);assert.ok(!data[key]);
files=[file('first','2026-02-01','PRIVATE')];const revision=state().revision;context.poll_();assert.equal(state().files,0);assert.equal(state().revision,revision);assert.equal(state().recent.length,0);
console.log('PASS: baseline, private files, owner guard, confirmation, deduplication, updates, quota retry, scan failure, unsubscribe, validation, expiry, removal.');
