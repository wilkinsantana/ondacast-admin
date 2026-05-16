// GET /api/export/unified.m3u?urls=...&names=...
// Fetches M3U playlists, re-parses channels with proper
// tvg-logo / group-title attributes, returns unified M3U.
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface Ch { name:string; logoUrl:string; group:string; url:string; tvgId:string; }

function comma(line:string):number {
  let q=false; for(let i=0;i<line.length;i++){ if(line[i]==='"')q=!q; if(line[i]===','&&!q)return i; } return -1;
}
function attrs(line:string):Record<string,string> {
  const o:Record<string,string>={};
  const re=/([a-zA-Z0-9_-]+)\s*=\s*(?:"([^"]*)"|([^\s,]+))/g; let m;
  while((m=re.exec(line))!==null)o[m[1].toLowerCase()]=m[2]??m[3]??''; return o;
}
function clean(raw:string):string {
  return raw.replace(/\s*\(\d{3,4}p\)/gi,'').replace(/\s*\(SD\)/gi,'').replace(/\s*\(HD\)/gi,'').replace(/[\u24C8\u24C9]/g,'').trim();
}
function parse(body:string):Ch[] {
  const out:Ch[]=[]; let pm:{name:string;attrs:Record<string,string>}|null=null;
  for(const raw of body.split(/\r?\n/)){
    const ln=raw.trim(); if(!ln)continue;
    if(ln.startsWith('#EXTINF')){ const ci=comma(ln); pm={name:ci>=0?ln.slice(ci+1).trim():'',attrs:attrs(ci>=0?ln.slice(0,ci):ln)}; continue; }
    if(ln.startsWith('#'))continue; if(!pm)continue;
    const nm=clean(pm.name||pm.attrs['tvg-name']||'Channel');
    out.push({name:nm,logoUrl:pm.attrs['tvg-logo']||'',group:pm.attrs['group-title']||'',url:ln,tvgId:pm.attrs['tvg-id']||pm.attrs['channel-id']||''}); pm=null;
  }
  return out;
}

export const GET: RequestHandler = async ({ url, fetch }) => {
  const us=(url.searchParams.get('urls')??'').split(',').map(decodeURIComponent).filter(Boolean);
  const ns=(url.searchParams.get('names')??'').split(',').map(decodeURIComponent).filter(Boolean);
  if(!us.length)return json({error:'Missing ?urls='},{status:400});

  const all:Ch[]=[]; const errs:string[]=[];
  for(let i=0;i<us.length;i++){const lb=ns[i]||us[i];
    try{const r=await fetch(us[i],{headers:{'User-Agent':'OndaCast-Admin/1.0'},signal:AbortSignal.timeout(30000)});
      if(!r.ok){errs.push(`${lb}:HTTP ${r.status}`);continue;}
      const b=await r.text();if(!b.includes('#EXTINF')){errs.push(`${lb}:not valid M3U`);continue;}
      all.push(...parse(b));}catch(e){errs.push(`${lb}:${(e as Error).message}`);}
  }
  if(!all.length)return json({error:'No channels',details:errs},{status:422});

  const lines=['#EXTM3U']; let n=1;
  for(const ch of all){
    const p=[`#EXTINF:-1 tvg-chno="${n}"`];
    if(ch.tvgId)p.push(`tvg-id="${ch.tvgId}"`); if(ch.logoUrl)p.push(`tvg-logo="${ch.logoUrl}"`);
    p.push(`group-title="${ch.group||'OndaCast'}"`); p.push(','+ch.name);
    lines.push(p.join(' ')); lines.push(ch.url); n++;
  }
  const outb=lines.join('\n')+'\n';
  return new Response(outb,{status:200,headers:{'Content-Type':'audio/x-mpegurl; charset=utf-8','Content-Disposition':`attachment; filename="ondacast-unified-${new Date().toISOString().slice(0,10)}.m3u"`,'Content-Length':String(new TextEncoder().encode(outb).length)}});
};
