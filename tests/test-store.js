// Tests for the data layer (store.js) using a pretend browser storage. Run: node tests/test-store.js
const fs=require('fs'), assert=require('assert/strict');
const dir=require('path').join(__dirname,'..','climb');
const code=['curriculum.js','sidemodule-finance.js','sidemodule-site.js','spanish.js','german.js','store.js'].map(f=>fs.readFileSync(dir+'/'+f,'utf8')).join('\n')+'\n;return {Store, CURRICULUM, SPANISH, GERMAN};';
// The older tests below were written before subjects existed. They now test the Data subject:
// questions and actions go to Store.subject('data'); saving, backup and dates stay on the Store.
const WHOLE=new Set(['init','SignInNeeded','signIn','signOut','email','flush','importJSON','exportJSON','storageOk','problem','mode','fresh','sessionKey','LoadError','onChange','onStatus','today','weekOf','addDays','subject','subjects','active','isLightWeek','setLightWeek','setTheme','minimumThisWeek','lastSessionAnywhere']);
function asData(St){ return new Proxy(St,{ get(t,k){ if(k==='real') return St; if(WHOLE.has(k)) return St[k]; const d=St.subject('data'); const v=d[k]; return typeof v==='function'?v.bind(d):v; } }); }
// online: { supabase, href } — the web version, with a pretend Supabase. Without it: the local file version.
function boot(storage, online){
  const window={localStorage:storage, addEventListener(){}};
  const location={protocol:'https:', hash:'', origin:'https://me.github.io', pathname:'/the-climb/', search:''};
  if(online){ window.supabase=online.supabase; window.CLIMB_CONFIG={supabaseUrl:'https://x.supabase.co', supabaseKey:'sb_publishable_x'}; if(online.protocol) location.protocol=online.protocol; if(online.hash) location.hash=online.hash; }
  const history={replaceState(a,b,url){ location.hash=url.slice(url.indexOf('#')); }};
  const document={addEventListener(){}, visibilityState:'visible'};
  const r=new Function('window','document','location','history',code)(window, document, location, history); return {...r, Store:asData(r.Store), location}; }
function memStorage(init={}){ const d={...init}; return {d, getItem:k=>k in d?d[k]:null, setItem:(k,v)=>{d[k]=String(v)}, removeItem:k=>delete d[k]}; }
console.warn=()=>{}; // expected warnings from the failure tests
let pass=0; const t=async(name,fn)=>{ await fn(); pass++; console.log('ok  '+name); };
(async()=>{

const mem=memStorage(); let {Store}=boot(mem); await Store.init();
await t('first open sets startDate to today', ()=>assert.equal(Store.state.startDate, Store.today()));
await t('first task is SQLBolt 1, day 1', async()=>{ assert.equal(Store.current().task.id,'sqlbolt-1'); assert.equal(Store.currentDay(),1); });
await t('upcoming(4) gives 4 in order', ()=>assert.deepEqual(Store.upcoming(4).map(x=>x.task.id),['sqlbolt-1','sqlbolt-2','sqlbolt-3','sqlbolt-4']));
await t('days ascend; Phases 1-3 end on day 180, Phase 4 runs 181-207', async()=>{ const ts=Store.tasks(); for(let i=1;i<ts.length;i++) assert.ok(ts[i].day>=ts[i-1].day);
  assert.equal(ts.filter(x=>x.phase.id==='python').at(-1).day<=180,true); assert.equal(ts.find(x=>x.phase.id==='de').day,181); assert.equal(ts.at(-1).day<=207,true); assert.equal(Store.totalDays(),180); });
Store.markDone('sqlbolt-1',35,'  easy start ');
await t('markDone moves to next + logs session', async()=>{ assert.equal(Store.current().task.id,'sqlbolt-2'); assert.deepEqual(Store.state.sessionLog[0],{date:Store.today(),minutes:35,note:'easy start',taskId:'sqlbolt-1'}); });
await t('persisted to storage', async()=>{ await Store.flush(); assert.ok(JSON.parse(mem.d['climb.progress']).subjects.data.completedTaskIds.includes('sqlbolt-1')); });
await t('survives "browser restart"', async()=>{ const b=boot(mem).Store; await b.init(); assert.equal(b.current().task.id,'sqlbolt-2'); assert.equal(b.state.startDate, Store.state.startDate); });
Store.skipToday('sqlbolt-2');
await t('Not today shows next task, without reordering', async()=>{ assert.equal(Store.current().task.id,'sqlbolt-3'); assert.ok(!Store.isDone('sqlbolt-2')); });
await t('skip only applies today: comes back first on another day', async()=>{ Store.state.skipped.date='2000-01-01'; assert.equal(Store.current().task.id,'sqlbolt-2'); Store.state.skipped.date=Store.today(); });
Store.undoSkip('sqlbolt-2');
await t('undo skip', ()=>assert.equal(Store.current().task.id,'sqlbolt-2'));
Store.markDone('sqlbolt-2',30,''); Store.undoDone('sqlbolt-2');
await t('undo done removes completion and its session', async()=>{ assert.equal(Store.current().task.id,'sqlbolt-2'); assert.equal(Store.state.sessionLog.length,1); });
await t('skipping everything left still shows one task', async()=>{ const m=boot(memStorage()).Store; await m.init(); m.tasks().forEach(x=>m.setDone(x.task.id,true)); m.setDone('update-cv',false); m.skipToday('update-cv'); assert.equal(m.current().task.id,'update-cv'); });
await t('finished state', async()=>{ const m=boot(memStorage()).Store; await m.init(); m.tasks().forEach(x=>m.setDone(x.task.id,true)); assert.equal(m.current(),null); assert.ok(m.isFinished()); assert.equal(m.currentDay(),207); });
await t('module complete unlocks skill line', async()=>{ const m=boot(memStorage()).Store; await m.init(); const mod=m.tasks()[0].module; mod.tasks.forEach(x=>m.markDone(x.id,10,'')); const s=m.skillsUnlocked(); assert.equal(s.length,1); assert.match(s[0].skill,/SELECT/); assert.equal(s[0].date,m.today()); });
await t('phase status: current / upcoming', async()=>{ const ps=Store.tasks()[0].phase; assert.equal(Store.phaseStats(ps).status,'current'); assert.equal(Store.phaseStats(Store.tasks().at(-1).phase).status,'upcoming'); });
await t('weekly streaks: a skipped day never breaks it', async()=>{ const m=boot(memStorage()).Store; await m.init(); const w=m.weekOf(m.today());
  const log=[m.addDays(w,-21),m.addDays(w,-12),m.addDays(w,-11),m.addDays(w,-3)].map(d=>({date:d,minutes:30,note:''}));
  m.importJSON(JSON.stringify({completedTaskIds:[],sessionLog:log})); { const {current,longest}=m.streaks(); assert.deepEqual({current,longest},{current:3,longest:3}); }; });
await t('weekly streak: a whole week off restarts current, keeps longest', async()=>{ const m=boot(memStorage()).Store; await m.init(); const w=m.weekOf(m.today());
  const log=[-35,-28,-21,-7].map(n=>({date:m.addDays(w,n),minutes:30,note:''}));
  m.importJSON(JSON.stringify({completedTaskIds:[],sessionLog:log})); { const {current,longest}=m.streaks(); assert.deepEqual({current,longest},{current:1,longest:3}); }; });
await t('weekly minutes add up', async()=>{ const wm=Store.weeklyMinutes(); assert.equal(wm[Store.weekOf(Store.today())],35); });
await t('export is valid JSON and imports into an empty machine intact', async()=>{ const txt=Store.exportJSON(); const p=JSON.parse(txt); assert.equal(p.app,'the-climb');
  const m=boot(memStorage()).Store; await m.init(); const r=m.importJSON(txt); assert.equal(r.ok,true);
  assert.deepEqual(m.state.completedTaskIds, Store.state.completedTaskIds); assert.deepEqual(m.state.sessionLog, Store.state.sessionLog); });

// ─── Import merges (two machines) ───
async function machine(progress){ const m=boot(memStorage({'climb.progress':JSON.stringify(progress)})).Store; await m.init(); return m; }
const S=(date,minutes,taskId,note='')=>({date,minutes,note,taskId});
await t('merge: tasks done on either machine end up done; nothing lost', async()=>{
  const mac=await machine({startDate:'2026-10-15',completedTaskIds:['sqlbolt-1','sqlbolt-2','sqlbolt-3'],sessionLog:[S('2026-10-15',30,'sqlbolt-1'),S('2026-10-16',30,'sqlbolt-2'),S('2026-10-17',30,'sqlbolt-3')]});
  const win=await machine({startDate:'2026-10-20',completedTaskIds:['sqlbolt-1','pq-about'],sessionLog:[S('2026-10-15',30,'sqlbolt-1'),S('2026-10-20',40,'pq-about')]});
  const r=mac.importJSON(win.exportJSON());
  assert.equal(r.tasksAdded,1); assert.equal(r.sessionsAdded,1);
  assert.deepEqual([...mac.state.completedTaskIds].sort(),['pq-about','sqlbolt-1','sqlbolt-2','sqlbolt-3']);
  assert.equal(mac.state.sessionLog.length,4); assert.deepEqual(mac.state.sessionLog.map(x=>x.date),['2026-10-15','2026-10-16','2026-10-17','2026-10-20']); });
await t('merge: importing the same file twice changes nothing', async()=>{
  const a=await machine({completedTaskIds:['sqlbolt-1'],sessionLog:[S('2026-10-15',30,'sqlbolt-1')]});
  const b=await machine({completedTaskIds:['sqlbolt-2'],sessionLog:[S('2026-10-16',30,'sqlbolt-2')]});
  const f=b.exportJSON(); a.importJSON(f); const before=JSON.stringify(a.state); const r=a.importJSON(f);
  assert.equal(r.tasksAdded,0); assert.equal(r.sessionsAdded,0); assert.equal(JSON.stringify(a.state),before); });
await t('merge: an older backup cannot wipe newer progress', async()=>{
  const now=await machine({completedTaskIds:['sqlbolt-1','sqlbolt-2'],sessionLog:[S('2026-10-15',30,'sqlbolt-1'),S('2026-10-16',30,'sqlbolt-2')]});
  const old=await machine({completedTaskIds:['sqlbolt-1'],sessionLog:[S('2026-10-15',30,'sqlbolt-1')]});
  now.importJSON(old.exportJSON()); assert.ok(now.isDone('sqlbolt-2')); assert.equal(now.state.sessionLog.length,2); });
await t('merge: two genuinely identical sessions stay as two', async()=>{
  const a=await machine({completedTaskIds:[],sessionLog:[S('2026-10-15',30,null),S('2026-10-15',30,null)]});
  const b=await machine({completedTaskIds:[],sessionLog:[S('2026-10-15',30,null)]});
  a.importJSON(b.exportJSON()); assert.equal(a.state.sessionLog.length,2);
  b.importJSON(a.exportJSON()); assert.equal(b.state.sessionLog.length,2); });
await t('merge: differing notes are both kept; blank side takes the other', async()=>{
  const a=await machine({completedTaskIds:[],sessionLog:[],notes:{'sql-joins':'mac note','sql-basics':'','dax':'same'}});
  const b=await machine({completedTaskIds:[],sessionLog:[],notes:{'sql-joins':'windows note','sql-basics':'only on windows','dax':'same'}});
  const r=a.importJSON(b.exportJSON()); assert.equal(r.notesMerged,1);
  assert.equal(a.state.notes['sql-joins'],'mac note\n\n— from your other machine —\nwindows note');
  assert.equal(a.state.notes['sql-basics'],'only on windows'); assert.equal(a.state.notes['dax'],'same');
  a.importJSON(b.exportJSON()); assert.equal(a.state.notes['sql-joins'].split('windows note').length,2); });
await t('merge: earliest start date; this machine keeps its links where set, and its settings', async()=>{
  const a=await machine({startDate:'2026-10-20',completedTaskIds:[],sessionLog:[],portfolioLinks:{sql:'https://github.com/me/sql'},settings:{theme:'dark',weeklyHoursTarget:6}});
  const b=await machine({startDate:'2026-10-15',completedTaskIds:[],sessionLog:[],portfolioLinks:{sql:'https://old',powerbi:'https://drive/pbi'},settings:{theme:'light',weeklyHoursTarget:4}});
  a.importJSON(b.exportJSON()); assert.equal(a.state.startDate,'2026-10-15');
  assert.deepEqual(a.state.portfolioLinks,{sql:'https://github.com/me/sql',powerbi:'https://drive/pbi'});
  assert.equal(a.state.weeklyHoursTarget,6); assert.equal(a.real.state.settings.theme,'dark'); });
await t('remove a session and put it back', async()=>{
  const a=await machine({completedTaskIds:[],sessionLog:[S('2026-10-15',30,null,'a'),S('2026-10-16',45,null,'b')]});
  const gone=a.removeSession(0); assert.equal(a.state.sessionLog.length,1); a.restoreSession(gone); assert.deepEqual(a.state.sessionLog.map(x=>x.note),['a','b']); });
await t('import rejects junk with plain message', async()=>{ assert.equal(Store.importJSON('nope').ok,false); assert.equal(Store.importJSON('{"a":1}').ok,false); assert.equal(Store.current().task.id,'sqlbolt-2'); });
await t('storage that throws: app still works in memory', async()=>{ const bad={getItem(){throw new Error('denied')},setItem(){throw new Error('denied')}}; const m=boot(bad).Store; await m.init(); assert.equal(m.storageOk,false); m.markDone('sqlbolt-1',30,''); assert.equal(m.current().task.id,'sqlbolt-2'); });
await t('damaged saved data: kept aside, app starts clean', async()=>{ const st=memStorage({'climb.progress':'{broken'}); const m=boot(st).Store; await m.init(); assert.equal(m.current().task.id,'sqlbolt-1'); assert.ok(Object.keys(st.d).some(k=>k.startsWith('climb.progress.damaged.'))); });
await t('unknown task ids (curriculum edited) are kept but harmless', async()=>{ const m=boot(memStorage({'climb.progress':JSON.stringify({completedTaskIds:['old-deleted-task','sqlbolt-1'],sessionLog:[]})})).Store; await m.init(); assert.equal(m.current().task.id,'sqlbolt-2'); assert.ok(m.state.completedTaskIds.includes('old-deleted-task')); });
await t('session log is always in date order, even if saved out of order', async()=>{ const m=await machine({completedTaskIds:[],sessionLog:[S('2026-10-14',30,null),S('2026-10-13',25,null),S('2026-10-15',40,null)]}); assert.deepEqual(m.state.sessionLog.map(x=>x.date),['2026-10-13','2026-10-14','2026-10-15']); });

// ─── Synced (the web version, with a pretend Supabase) ───
// Answers the way supabase-js does: { data, error, status }, never throwing.
function fakeDb({initial=null, failLoad=false, slow=0, signedIn=true}={}){
  const clone=(x)=>JSON.parse(JSON.stringify(x));
  let doc=initial?clone(initial):null, listener=null, inFlight=0, maxInFlight=0, session=signedIn?{user:{id:'u1',email:'me@example.com'}}:null; const writes=[];
  const f={ writes, failWrite:null, otp:null, verified:null, signOuts:0 };
  const mine=()=>({ eq(col,v){ assert.equal(col,'user_id'); assert.equal(v,'u1'); return this; },
    async maybeSingle(){ if(failLoad==='paused') return {data:null,error:{message:'Project paused'},status:540};
      if(failLoad==='signed_out') return {data:null,error:{code:'PGRST301',message:'JWT expired'},status:401};
      if(failLoad) return {data:null,error:{message:'TypeError: Failed to fetch'},status:0};
      return {data:doc?{data:clone(doc)}:null,error:null,status:200}; } });
  const client={
    auth:{ async getSession(){ return {data:{session},error:null}; }, async signOut(){ f.signOuts++; session=null; return {error:null}; },
      async signInWithPassword(a){ f.signedInWith=a; return {error:f.signInError||null}; } },
    from(t){ assert.equal(t,'progress'); return {
      select(cols){ assert.equal(cols,'data'); return mine(); },
      async upsert(row){ inFlight++; maxInFlight=Math.max(maxInFlight,inFlight); await new Promise(r=>setTimeout(r,slow)); inFlight--;
        if(f.failWrite) return f.failWrite; assert.equal(row.user_id,'u1'); doc=clone(row.data); writes.push(doc); return {data:null,error:null,status:201}; } }; },
    channel(){ return { on(type,opts,cb){ assert.equal(type,'postgres_changes'); assert.equal(opts.filter,'user_id=eq.u1'); listener=cb; return this; }, subscribe(){ return this; } }; }
  };
  Object.defineProperties(f, { doc:{get:()=>doc}, maxInFlight:{get:()=>maxInFlight} });
  return Object.assign(f, { supabase:{createClient:()=>client},
    // Postgres hands JSON back with its keys in its own order; the pretend one reverses them.
    fromOtherDevice(d){ const shuffle=(x)=>Array.isArray(x)?x.map(shuffle):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).reverse().map(([k,v])=>[k,shuffle(v)])):x;
      doc=clone(d); listener({eventType:'UPDATE', new:{user_id:'u1', data:shuffle(doc)}}); } });
}
async function synced(f, storage=memStorage()){ const m=boot(storage, f).Store; await m.init(); await m.flush(); return m; }
const tick=()=>new Promise(r=>setTimeout(r,0));

await t('synced: loads progress from the database, ignores and never touches localStorage', async()=>{
  const ls=memStorage({'climb.progress':JSON.stringify({completedTaskIds:['pq-about'],sessionLog:[]})}); const before=ls.d['climb.progress'];
  const f=fakeDb({initial:{startDate:'2026-10-01',completedTaskIds:['sqlbolt-1'],sessionLog:[S('2026-10-01',30,'sqlbolt-1')]}});
  const m=await synced(f, ls); assert.equal(m.mode,'synced'); assert.equal(m.fresh,false);
  assert.equal(m.current().task.id,'sqlbolt-2'); assert.ok(!m.isDone('pq-about'));
  m.markDone('sqlbolt-2',20,''); await m.flush();
  assert.ok(f.doc.subjects.data.completedTaskIds.includes('sqlbolt-2')); assert.equal(ls.d['climb.progress'],before); assert.equal(Object.keys(ls.d).length,1); });
await t('synced: empty database counts as fresh and saves the start date there', async()=>{
  const f=fakeDb(); const m=await synced(f); assert.equal(m.fresh,true); await m.flush(); assert.equal(f.doc.subjects.data.startDate,m.today()); });
await t('synced: a failed load stops start-up and never writes (so it cannot wipe real progress)', async()=>{
  const f=fakeDb({failLoad:true}); const m=boot(memStorage(), f).Store;
  await assert.rejects(m.init(), (e)=>e instanceof m.LoadError && /Couldn't load/.test(e.message));
  assert.equal(f.writes.length,0); });
await t('synced: a paused Supabase project says so, and never writes', async()=>{
  const f=fakeDb({failLoad:'paused'}); const m=boot(memStorage(), f).Store;
  await assert.rejects(m.init(), (e)=>e instanceof m.LoadError && /paused/.test(e.message) && /Restore project/.test(e.message));
  assert.equal(f.writes.length,0); });
await t('synced: not signed in asks you to sign in, and never writes', async()=>{
  const f=fakeDb({signedIn:false}); const m=boot(memStorage(), f).Store; await assert.rejects(m.init(), (e)=>e instanceof m.SignInNeeded); assert.equal(f.writes.length,0); });
await t('synced: a sign-in the database no longer accepts is forgotten, and asks again', async()=>{
  const f=fakeDb({failLoad:'signed_out'}); const m=boot(memStorage(), f).Store; await assert.rejects(m.init(), (e)=>e instanceof m.SignInNeeded); assert.equal(f.signOuts,1); assert.equal(f.writes.length,0); });
await t('synced: signs in with email and password, and says plainly when they are wrong', async()=>{
  const f=fakeDb({signedIn:false}); const m=boot(memStorage(), f).Store; await m.init().catch(()=>{});
  await m.signIn('me@example.com','pw'); assert.deepEqual(f.signedInWith,{email:'me@example.com',password:'pw'});
  f.signInError={status:400,code:'invalid_credentials',message:'Invalid login credentials'}; await assert.rejects(m.signIn('me@example.com','nope'), /don't match/);
  f.signInError={status:429,message:'Request rate limit reached'}; await assert.rejects(m.signIn('me@example.com','nope'), /Too many/);
  f.signInError={status:0,message:'Failed to fetch'}; await assert.rejects(m.signIn('me@example.com','pw'), /connection/); });
await t('opened as a file: stays local even though config.js names a project', async()=>{
  const f=fakeDb(); const m=boot(memStorage(), {supabase:f.supabase, protocol:'file:'}).Store; await m.init(); assert.equal(m.mode,'local'); });
await t('synced: saves go one at a time and the last state wins', async()=>{
  const f=fakeDb({slow:15}); const m=await synced(f); const ids=m.upcoming(5).map(x=>x.task.id);
  ids.forEach(id=>m.markDone(id,10,'')); await m.flush();
  assert.equal(f.maxInFlight,1); assert.ok(f.writes.length<ids.length+1, 'bursts are combined');
  assert.deepEqual(f.doc.subjects.data.completedTaskIds, ids); assert.equal(f.doc.subjects.data.sessionLog.length,5); });
await t('synced: a change from another device arrives and redraws', async()=>{
  const f=fakeDb({initial:{startDate:'2026-10-01',completedTaskIds:[],sessionLog:[]}}); const m=await synced(f); const seen=[]; m.onChange(i=>seen.push(i));
  f.fromOtherDevice({startDate:'2026-10-01',completedTaskIds:['sqlbolt-1'],sessionLog:[S('2026-10-20',25,'sqlbolt-1')]});
  assert.ok(m.isDone('sqlbolt-1')); assert.deepEqual(seen,[{remote:true}]); });
await t('synced: our own save coming back does not redraw', async()=>{
  const f=fakeDb({initial:{startDate:'2026-10-01',completedTaskIds:[],sessionLog:[]}}); const m=await synced(f);
  m.markDone('sqlbolt-1',10,''); m.setNote('sql-basics','b'); m.setNote('pq-basics','a'); await m.flush(); const seen=[]; m.onChange(i=>seen.push(i)); f.fromOtherDevice(f.doc); assert.equal(seen.length,0); });
await t('synced: saving while signed out is reported in words', async()=>{
  const f=fakeDb(); const m=await synced(f); f.failWrite={data:null,error:{code:'PGRST301',message:'JWT expired'},status:401};
  m.markDone('sqlbolt-1',10,''); await m.flush(); assert.match(m.problem,/signed out/); });
await t('synced: while this device is still saving, an older update cannot undo its change', async()=>{
  const f=fakeDb({initial:{startDate:'2026-10-01',completedTaskIds:[],sessionLog:[]},slow:20}); const m=await synced(f);
  m.markDone('sqlbolt-1',10,''); f.fromOtherDevice({startDate:'2026-10-01',completedTaskIds:[],sessionLog:[]});
  assert.ok(m.isDone('sqlbolt-1')); await m.flush(); assert.ok(f.doc.subjects.data.completedTaskIds.includes('sqlbolt-1')); });
await t('synced: typing a note saves after a pause, and leaving the page saves it at once', async()=>{
  const f=fakeDb({initial:{startDate:'2026-10-01',completedTaskIds:[],sessionLog:[]}}); const m=await synced(f); const n=f.writes.length;
  m.setNote('sql-basics','h'); m.setNote('sql-basics','hel'); m.setNote('sql-basics','hello'); await tick(); assert.equal(f.writes.length,n,'waits for a pause');
  f.fromOtherDevice({startDate:'2026-10-01',completedTaskIds:[],sessionLog:[],notes:{}}); assert.equal(m.state.notes['sql-basics'],'hello','unsaved typing is never overwritten');
  await m.flush(); assert.equal(f.doc.subjects.data.notes['sql-basics'],'hello'); assert.equal(f.writes.length,n+1); });
await t('synced: a failed save is reported in words, and clears on the next good save', async()=>{
  const f=fakeDb({initial:{startDate:'2026-10-01',completedTaskIds:[],sessionLog:[]}}); const m=await synced(f); let calls=0; m.onStatus(()=>calls++);
  f.failWrite={data:null,error:{message:'TypeError: Failed to fetch'},status:0}; m.markDone('sqlbolt-1',10,''); await m.flush();
  assert.equal(m.storageOk,false); assert.match(m.problem,/connection/); f.failWrite=null; m.markDone('sqlbolt-2',10,''); await m.flush();
  assert.equal(m.storageOk,true); assert.equal(m.problem,null); assert.equal(calls,2); });
await t('remove session: finds the right one even if another device shifted the list', async()=>{
  const a=await machine({completedTaskIds:[],sessionLog:[S('2026-10-15',30,null,'a'),S('2026-10-16',45,null,'b')]});
  const keyB=a.sessionKey(a.state.sessionLog[1]); a.restoreSession(S('2026-10-14',10,null,'new'));
  const gone=a.removeSession(1,keyB); assert.equal(gone.note,'b'); assert.deepEqual(a.state.sessionLog.map(x=>x.note),['new','a']); });

// ─── Subjects (Part B) ───
async function school(progress){ const mem=memStorage(progress?{'climb.progress':JSON.stringify(progress)}:{}); const {Store:St}=boot(mem); const real=St.real; await real.init(); await real.flush(); return {St:real, mem}; }
await t('old progress (before subjects) moves to Data intact, saved in the new shape', async()=>{
  const v1={version:1,startDate:'2026-09-01',completedTaskIds:['sqlbolt-1','sqlbolt-2'],sessionLog:[S('2026-09-01',30,'sqlbolt-1','hi'),S('2026-09-02',35,'sqlbolt-2')],notes:{'sql-basics':'a note'},portfolioLinks:{sql:'https://github.com/me/sql'},skipped:{date:null,taskIds:[]},settings:{theme:'dark',weeklyHoursTarget:6}};
  const {St,mem}=await school(v1); const d=St.subject('data').state;
  assert.equal(d.startDate,'2026-09-01'); assert.deepEqual(d.completedTaskIds,v1.completedTaskIds); assert.deepEqual(d.sessionLog,v1.sessionLog);
  assert.deepEqual(d.notes,v1.notes); assert.deepEqual(d.portfolioLinks,v1.portfolioLinks); assert.equal(d.weeklyHoursTarget,6); assert.equal(St.state.settings.theme,'dark');
  const saved=JSON.parse(mem.d['climb.progress']); assert.equal(saved.version,2); assert.deepEqual(saved.subjects.data.completedTaskIds,v1.completedTaskIds);
  assert.equal(St.subject('spanish').state.startDate,St.today()); assert.equal(St.subject('spanish').state.completedTaskIds.length,0); });
await t('Spanish runs in order: five tracks, listening, review — then the next week', async()=>{
  const {St}=await school(); const es=St.subject('spanish');
  assert.deepEqual(es.upcoming(8).map(x=>x.task.id),['es-lt-01','es-lt-02','es-lt-03','es-lt-04','es-lt-05','es-w01-listen','es-w01-review','es-lt-06']);
  assert.equal(es.current().module.name,'Week 1'); assert.equal(es.unit,'week'); });
await t('Spanish plan: 39 weeks of 7, tracks 1–90 once each, 66–90 spill into Term 2, exams last in their terms', async()=>{
  const {St}=await school(); const es=St.subject('spanish'); const all=es.tasks();
  assert.equal(es.totalDays(),273); assert.equal(all.length,273);
  es.plan.phases.forEach(p=>{ assert.equal(p.modules.length,13); p.modules.forEach(m=>assert.equal(m.tasks.length,7)); });
  const tracks=all.filter(x=>x.task.id.startsWith('es-lt-')); assert.equal(tracks.length,90);
  assert.equal(es.find('es-lt-65').phase.id,'es-term-1'); assert.equal(es.find('es-lt-66').phase.id,'es-term-2'); assert.equal(es.find('es-lt-90').module.name,'Week 18');
  assert.equal(es.find('es-t1-exam').module.name,'Week 13'); assert.equal(es.find('es-t2-exam').module.name,'Week 26');
  assert.ok(es.find('es-partner').index < es.find('es-t2-exam').index); });
await t('German is locked until the Spanish Term 2 exam is ticked, and unticking locks it again', async()=>{
  const {St}=await school(); const de=St.subject('german'), es=St.subject('spanish');
  assert.equal(de.locked,true); assert.deepEqual(St.active().map(s=>s.id),['data','spanish']);
  es.setDone('es-t1-exam',true); assert.equal(de.locked,true);
  es.setDone('es-t2-exam',true); assert.equal(de.locked,false); assert.deepEqual(St.active().map(s=>s.id),['data','spanish','german']);
  es.setDone('es-t2-exam',false); assert.equal(de.locked,true); });
await t('subjects keep separate progress, streaks and weekly hours', async()=>{
  const {St}=await school(); const d=St.subject('data'), es=St.subject('spanish');
  d.markDone('sqlbolt-1',40,''); es.markDone('es-lt-01',18,'');
  assert.equal(d.current().task.id,'sqlbolt-2'); assert.equal(es.current().task.id,'es-lt-02');
  assert.equal(d.minutesThisWeek(),40); assert.equal(es.minutesThisWeek(),18); assert.equal(es.streaks().thisWeek,true);
  assert.equal(St.lastSessionAnywhere().session.minutes>0,true); });
const weekday=(St)=>{ const n=new Date().getDay(); return n>=1&&n<=5; };
await t('light week: on for this week only; adds Data blocks on weekdays (up to 3) and Spanish listening daily; never German', async()=>{
  const {St}=await school(); const d=St.subject('data'), es=St.subject('spanish'), de=St.subject('german');
  assert.equal(St.isLightWeek(),false); assert.equal(d.extraToday(),null); assert.equal(es.extraToday(),null);
  St.setLightWeek(true); assert.equal(St.isLightWeek(),true);
  const x=es.extraToday(); assert.equal(x.minutes,15); assert.equal(x.number,1);
  if(weekday(St)){ const b=d.extraToday(); assert.equal(b.minutes,60); assert.equal(b.number,1); } else assert.equal(d.extraToday(),null);
  es.logSession(15,'Light week listening',null,true); assert.equal(es.extraToday(),null,'one a day');
  assert.equal(es.state.sessionLog[0].extra,true);
  es.setDone('es-t2-exam',true); assert.equal(de.locked,false); assert.equal(de.extraToday(),null,'never German');
  St.state.settings.lightWeek=St.addDays(St.weekOf(St.today()),-7); assert.equal(St.isLightWeek(),false,'switches itself off next week');
  St.setLightWeek(true); St.setLightWeek(false); assert.equal(St.state.settings.lightWeek,null); });
await t('light week: Data stops offering blocks after 3 this week', async()=>{
  const {St}=await school(); const d=St.subject('data'); St.setLightWeek(true); if(!weekday(St)) return;
  const mon=St.weekOf(St.today()); const otherDays=[0,1,2,3,4].map(i=>St.addDays(mon,i)).filter(x=>x!==St.today());
  d.logSession(60,'',otherDays[0],true); d.logSession(60,'',otherDays[1],true); assert.equal(d.extraToday().number,3,'third still offered');
  d.logSession(60,'',otherDays[2],true); assert.equal(d.extraToday(),null); });
await t('bad-week minimum: 3 hrs of Data and one Spanish session', async()=>{
  const {St}=await school(); let m=St.minimumThisWeek(); assert.deepEqual(m,{dataMinutes:0,dataNeeded:180,spanishKept:false});
  St.subject('data').logSession(120,''); St.subject('spanish').logSession(15,''); m=St.minimumThisWeek(); assert.equal(m.dataMinutes,120); assert.equal(m.spanishKept,true); });
await t('export holds every subject; import merges subject by subject; an old backup goes to Data', async()=>{
  const a=(await school()).St, b=(await school()).St;
  a.subject('data').markDone('sqlbolt-1',30,''); a.subject('spanish').markDone('es-lt-01',18,'x');
  const file=JSON.parse(a.exportJSON()); assert.ok(file.progress.subjects.data && file.progress.subjects.spanish && file.progress.subjects.german);
  const r=b.importJSON(a.exportJSON()); assert.equal(r.ok,true); assert.equal(r.tasksAdded,2);
  assert.ok(b.subject('spanish').isDone('es-lt-01')); assert.ok(!b.subject('data').isDone('es-lt-01'));
  assert.equal(b.importJSON(a.exportJSON()).tasksAdded,0,'twice changes nothing');
  const old=b.importJSON(JSON.stringify({app:'the-climb',progress:{version:1,completedTaskIds:['pq-about'],sessionLog:[S('2026-09-01',30,'pq-about')]}}));
  assert.equal(old.ok,true); assert.ok(b.subject('data').isDone('pq-about')); assert.ok(!b.subject('spanish').isDone('pq-about')); });
await t('progress saved by a newer version: this copy refuses to load or save over it', async()=>{
  const f=fakeDb({initial:{version:3,subjects:{}}}); const m=boot(memStorage(), f).Store.real;
  await assert.rejects(m.init(), (e)=>/newer version/.test(e.message)); assert.equal(f.writes.length,0);
  const g=fakeDb({initial:{startDate:'2026-10-01',completedTaskIds:[],sessionLog:[]}}); const n=boot(memStorage(), g).Store.real; await n.init(); await n.flush();
  const before=g.writes.length; g.fromOtherDevice({version:3,subjects:{}}); assert.match(n.problem,/newer version/);
  n.subject('data').markDone('sqlbolt-1',10,''); await n.flush(); assert.equal(g.writes.length,before,'no saves after that'); });

// ─── Start date and Start over ───
await t('changing a start date keeps every tick and session', async()=>{
  const {St}=await school(); const d=St.subject('data'); d.markDone('sqlbolt-1',30,''); d.setDone('sqlbolt-2',true);
  assert.equal(d.setStartDate('2026-09-01'),true); assert.equal(d.state.startDate,'2026-09-01');
  assert.deepEqual(d.state.completedTaskIds,['sqlbolt-1','sqlbolt-2']); assert.equal(d.state.sessionLog.length,1);
  assert.equal(d.setStartDate('not a date'),false); assert.equal(d.state.startDate,'2026-09-01'); });
await t('start over: clears that subject only, starts today, keeps Portfolio links and target; undo brings it all back', async()=>{
  const {St}=await school(); const d=St.subject('data'), es=St.subject('spanish');
  d.markDone('sqlbolt-1',30,'n'); d.setNote('sql-basics','note'); d.setPortfolioLink('sql','https://github.com/me/sql'); d.setTarget(6); d.skipToday('sqlbolt-2'); d.setStartDate('2026-09-01');
  es.markDone('es-lt-01',18,'');
  const before=d.startOver();
  assert.deepEqual(d.state.completedTaskIds,[]); assert.equal(d.state.sessionLog.length,0); assert.deepEqual(d.state.notes,{}); assert.deepEqual(d.state.skipped.taskIds,[]);
  assert.equal(d.state.startDate,St.today()); assert.equal(d.current().task.id,'sqlbolt-1');
  assert.deepEqual(d.state.portfolioLinks,{sql:'https://github.com/me/sql'}); assert.equal(d.state.weeklyHoursTarget,6);
  assert.ok(es.isDone('es-lt-01'),'Spanish untouched');
  d.restore(before); assert.ok(d.isDone('sqlbolt-1')); assert.equal(d.state.notes['sql-basics'],'note'); assert.equal(d.state.startDate,'2026-09-01'); });
await t('start over is saved, so other devices see it', async()=>{
  const f=fakeDb({initial:{startDate:'2026-09-01',completedTaskIds:['sqlbolt-1'],sessionLog:[S('2026-09-01',30,'sqlbolt-1')]}}); const m=(await synced(f)).real;
  m.subject('data').startOver(); await m.flush();
  assert.deepEqual(f.doc.subjects.data.completedTaskIds,[]); assert.equal(f.doc.subjects.data.startDate,m.today()); });

// ─── Side modules (Data's Finance & SAP) ───
await t('side module: not in the plan, so Data keeps 180 days and its own next task', async()=>{
  const {St}=await school(); const d=St.subject('data'); const fin=d.side('fin');
  assert.equal(d.totalDays(),180); assert.ok(!d.tasks().some(x=>x.task.id.startsWith('fin-')));
  assert.equal(fin.tasks().length,10); assert.equal(fin.current().task.id,'fin-pnl'); assert.equal(fin.minutesLeft(),390);
  assert.equal(d.current().task.id,'sqlbolt-1'); assert.equal(d.currentDay(),1); });
await t('side module: Done logs to Data (hours count), moves the side on, leaves Data where it was', async()=>{
  const {St}=await school(); const d=St.subject('data'); const fin=d.side('fin');
  d.markDone('fin-pnl',30,'ok'); assert.ok(d.isDone('fin-pnl')); assert.equal(fin.current().task.id,'fin-cost-centers');
  assert.equal(d.current().task.id,'sqlbolt-1'); assert.equal(d.minutesThisWeek(),30); assert.equal(St.minimumThisWeek().dataMinutes,30);
  d.undoDone('fin-pnl'); assert.equal(fin.current().task.id,'fin-pnl'); assert.equal(d.state.sessionLog.length,0); });
await t('side module: Not today skips only the side task, for today', async()=>{
  const {St}=await school(); const d=St.subject('data'); const fin=d.side('fin');
  d.skipToday('fin-pnl'); assert.equal(fin.current().task.id,'fin-cost-centers'); assert.equal(d.current().task.id,'sqlbolt-1');
  d.state.skipped.date='2000-01-01'; assert.equal(fin.current().task.id,'fin-pnl'); });
await t('side module: finishing it never finishes Data; adds its skill line; Map ticks work', async()=>{
  const {St}=await school(); const d=St.subject('data'); const fin=d.side('fin');
  fin.tasks().forEach(x=>d.setDone(x.task.id,true));
  assert.equal(fin.isFinished(),true); assert.equal(fin.current(),null); assert.equal(d.isFinished(),false); assert.equal(d.current().task.id,'sqlbolt-1');
  const sk=d.skillsUnlocked(); assert.equal(sk.length,1); assert.equal(sk[0].where,fin.name);
  d.setDone('fin-kpis',false); assert.equal(fin.current().task.id,'fin-kpis'); });
await t('side module: progress travels in export/import and survives Start over undo', async()=>{
  const a=(await school()).St, b=(await school()).St; a.subject('data').markDone('fin-olap',30,'');
  b.importJSON(a.exportJSON()); assert.ok(b.subject('data').isDone('fin-olap'));
  const d=b.subject('data'); d.setPortfolioLink('fin-variance','https://github.com/me/variance'); const before=d.startOver();
  assert.ok(!d.isDone('fin-olap')); assert.equal(d.state.portfolioLinks['fin-variance'],'https://github.com/me/variance');
  d.restore(before); assert.ok(d.isDone('fin-olap')); });

// ─── Optional tasks (the CS50 video and submission) ───
await t('optional tasks: never on Today or in the day count, but tickable on the Map', async()=>{
  const m=boot(memStorage()).Store; await m.init();
  assert.ok(!m.tasks().some(x=>x.task.optional)); assert.ok(m.find('tel-video').optional);
  const tel=m.find('tel-readme').module; tel.tasks.filter(x=>!x.optional).forEach(x=>m.setDone(x.id,true));
  assert.equal(m.moduleStats(tel).complete,true); assert.equal(m.moduleStats(tel).total,tel.tasks.length-2);
  assert.notEqual(m.current().module.id,'telecom');
  m.markDone('tel-video',60,''); assert.ok(m.isDone('tel-video')); assert.equal(m.state.sessionLog.at(-1).taskId,'tel-video'); });

// ─── Portfolio site side module ───
await t('site module: locked until the telecom README is done; then on Today; untick locks it again', async()=>{
  const m=boot(memStorage()).Store; await m.init(); const site=m.side('site');
  assert.equal(site.locked(),true); assert.equal(site.current(),null); assert.equal(m.totalDays(),180);
  assert.ok(!m.tasks().some(x=>x.task.id.startsWith('site-')));
  m.setDone('tel-readme',true); assert.equal(site.locked(),false); assert.equal(site.current().task.id,'site-rules');
  m.setDone('tel-readme',false); assert.equal(site.current(),null); });
await t('site module: card reminders wait for their project; stretch steps never on Today', async()=>{
  const m=boot(memStorage()).Store; await m.init(); const site=m.side('site'); m.setDone('tel-readme',true);
  site.tasks().filter(x=>!x.task.unlockedBy).forEach(x=>m.setDone(x.task.id,true));
  assert.equal(site.current(),null); assert.equal(site.isFinished(),false);
  assert.deepEqual(site.waiting().map(w=>w.waitsFor.task.id),['bva-readme','mail-readme','dbt-readme']);
  assert.ok(!site.tasks().some(x=>x.task.optional));
  m.setDone('bva-readme',true); assert.equal(site.current().task.id,'site-card-pbi');
  m.setDone('site-card-pbi',true); m.setDone('mail-readme',true); m.setDone('site-card-py',true); m.setDone('dbt-readme',true); m.setDone('site-card-dbt',true);
  assert.equal(site.isFinished(),true); assert.equal(m.side('fin').isFinished(),false); });

// ─── Phase 4 ───
await t('Phase 4: the dbt layer is required, with a README; hour check right after Docker set-up', async()=>{
  const m=boot(memStorage()).Store; await m.init(); const ids=m.tasks().filter(x=>x.phase.id==='de').map(x=>x.task.id);
  assert.ok(ids.includes('dbt-readme')); assert.ok(!m.find('dbt-readme').optional);
  assert.equal(ids[ids.indexOf('de-docker-setup')+1],'de-hours-check');
  m.tasks().filter(x=>x.phase.id!=='de').forEach(x=>m.setDone(x.task.id,true));
  assert.equal(m.current().task.id,'de-start'); assert.equal(m.currentDay(),181); });

// ─── The switch to CS50 SQL, with the real backup from 12 Nov ───
await t('backup from before the switch: 10 tasks kept, next is CS50 set-up on day 11; Spanish untouched', async()=>{
  // Point CLIMB_BACKUP at the export from 12 Nov to run this one; it's skipped otherwise.
  const file=process.env.CLIMB_BACKUP; if(!file || !fs.existsSync(file)) return;
  const raw=fs.readFileSync(file,'utf8'); const {Store:St}=boot(memStorage()); await St.init(); St.importJSON(raw);
  const d=St.real.subject('data'), es=St.real.subject('spanish');
  assert.equal(d.state.completedTaskIds.length,10); assert.ok(d.state.completedTaskIds.every(id=>d.find(id)));
  assert.equal(d.moduleStats(d.find('cheatsheet-start').module).complete,true);
  assert.equal(d.current().task.id,'cs50-setup'); assert.equal(d.currentDay(),11);
  assert.equal(d.state.sessionLog.reduce((a,s)=>a+s.minutes,0),350);
  const before=JSON.parse(raw).progress.subjects.spanish;
  assert.deepEqual(es.state.completedTaskIds,before.completedTaskIds); assert.deepEqual(es.state.sessionLog,before.sessionLog); });

console.log(`\n${pass} passed`);
})().catch(e=>{ console.error(e); process.exit(1); });
