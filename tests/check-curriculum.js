// Checks the plan files (curriculum.js, spanish.js, german.js, sidemodule-*.js): unique ids across all of them,
// contiguous day ranges, required fields. Run: node tests/check-curriculum.js
const fs=require('fs');
const dir=require('path').join(__dirname,'..','climb');
const load=(file,name)=>new Function(fs.readFileSync(dir+'/'+file,'utf8')+';return '+name+';')();
const PLANS=[
  {name:'Data', plan:load('curriculum.js','CURRICULUM'), needsSkill:true},
  {name:'Spanish', plan:load('spanish.js','SPANISH'), needsSkill:false},
  {name:'German', plan:load('german.js','GERMAN'), needsSkill:false}
];
const types=new Set(['interactive','video','reading','practice','build','setup','listening','exam']);
const ids=new Set(), errs=[];
for(const {name, plan, needsSkill} of PLANS){
  let prevEnd=0, total=0, n=0;
  console.log(`— ${name}`);
  for(const p of plan.phases){
    if(p.dayStart!==prevEnd+1) errs.push(`${name}: phase ${p.id} starts ${p.dayStart}, expected ${prevEnd+1}`);
    let mEnd=p.dayStart-1, pm=0;
    for(const m of p.modules){
      if(m.dayStart!==mEnd+1) errs.push(`${name}: module ${m.id} starts ${m.dayStart}, expected ${mEnd+1}`);
      mEnd=m.dayEnd; if(needsSkill && !m.skill) errs.push(`${name}: module ${m.id} has no skill`);
      if(!m.tasks.length) errs.push(`${name}: module ${m.id} has no tasks`);
      for(const t of m.tasks){ n++;
        if(ids.has(t.id)) errs.push('dup id '+t.id); ids.add(t.id);
        if(!types.has(t.type)) errs.push('bad type '+t.id);
        for(const k of ['label','detail','estimatedMinutes']) if(!t[k]) errs.push(`${t.id} missing ${k}`);
        if(typeof t.url!=='string') errs.push(t.id+' url not string');
        pm+=t.estimatedMinutes; }
    }
    if(mEnd!==p.dayEnd) errs.push(`${name}: phase ${p.id} modules end ${mEnd}, phase ends ${p.dayEnd}`);
    prevEnd=p.dayEnd; total+=pm;
    console.log(`${p.name}: ${p.modules.reduce((a,m)=>a+m.tasks.length,0)} tasks, ${(pm/60).toFixed(1)}h (plan says ~${p.estimatedHours}h)`);
  }
  // Phases fill totalDays exactly; a phase may follow after it (Data's Phase 4).
  if(!plan.phases.some(p=>p.dayEnd===plan.totalDays)) errs.push(`${name}: no phase ends on day ${plan.totalDays}`);
  console.log(`TOTAL ${n} tasks, ${(total/60).toFixed(1)}h`);
}
// Side modules: no days, but the same task rules, and ids unique across everything.
const dataIds=new Set(PLANS[0].plan.phases.flatMap(p=>p.modules.flatMap(m=>m.tasks.map(t=>t.id))));
for(const [file,name] of [['sidemodule-finance.js','SIDE_FINANCE'],['sidemodule-site.js','SIDE_SITE'],['sidemodule-etl.js','SIDE_ETL']]){
  const sm=load(file,name); let n=0, mins=0;
  for(const m of sm.modules){ if(!m.tasks.length) errs.push(`${name}: module ${m.id} has no tasks`);
    for(const t of m.tasks){ n++; mins+=t.estimatedMinutes;
      if(ids.has(t.id)) errs.push('dup id '+t.id); ids.add(t.id);
      if(!types.has(t.type)) errs.push('bad type '+t.id);
      for(const k of ['label','detail','estimatedMinutes']) if(!t[k]) errs.push(`${t.id} missing ${k}`);
      if(typeof t.url!=='string' || (!t.url && !['build','practice'].includes(t.type))) errs.push(`${t.id} needs a link`);
      if(t.unlockedBy && !dataIds.has(t.unlockedBy)) errs.push(`${t.id} waits for unknown task ${t.unlockedBy}`);
      for(const x of t.more||[]) if(!x.label||!/^https:\/\//.test(x.url)) errs.push(`${t.id} has a bad extra link`); } }
  if(sm.unlockedBy && !dataIds.has(sm.unlockedBy.taskId)) errs.push(`${name}: unlocks on unknown task ${sm.unlockedBy.taskId}`);
  if(sm.portfolio && !sm.modules.some(m=>m.tasks.some(t=>t.id===sm.portfolio.taskId))) errs.push(`${name}: portfolio task ${sm.portfolio.taskId} not found`);
  console.log(`— Side module ${sm.name}: ${n} tasks, ${(mins/60).toFixed(1)}h`);
}
console.log(errs.length?errs.join('\n'):'structure OK');
if(errs.length) process.exit(1);
