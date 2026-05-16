<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Download, RefreshCw, Radio, Copy, Check, Globe } from 'lucide-svelte';

  // ── M3U ──
  interface TVPlaylist { id:string; name:string; url:string; type:string; visible:boolean; channelCount?:number; lastSyncedAt?:number; }
  let playlists = $state<TVPlaylist[]>([]);
  let loading = $state(true);
  let exporting = $state(false);
  let exportError = $state('');
  let exportOk = $state('');

  onMount(async () => { await Promise.all([loadPlaylists(), loadEpgStatus()]); });

  async function loadPlaylists() {
    loading = true;
    try {
      const r = await fetch('/me/tv/playlists', { credentials: 'include' });
      if (r.ok) { playlists = (await r.json()).playlists?.filter((p:TVPlaylist)=>p.type==='m3u') ?? []; }
      else {
        const r2 = await fetch('/me', { credentials: 'include' });
        if (r2.ok) { const tv = (await r2.json())?.user?.preferences?.tv ?? {}; playlists = (tv.playlists??[]).filter((p:TVPlaylist)=>p.type==='m3u'); }
      }
    } catch { playlists = []; }
    finally { loading = false; }
  }

  async function exportUnified() {
    if (playlists.length===0) return;
    exporting=true; exportError=''; exportOk='';
    const urls=playlists.map(p=>encodeURIComponent(p.url)).join(',');
    const names=playlists.map(p=>encodeURIComponent(p.name)).join(',');
    try {
      const r=await fetch(`/api/export/unified.m3u?urls=${urls}&names=${names}`,{credentials:'include'});
      if(!r.ok){const e=await r.json().catch(()=>({error:`HTTP ${r.status}`}));exportError=e.error||`Export failed`;return;}
      const b=await r.blob();const a=document.createElement('a');
      a.href=URL.createObjectURL(b);a.download=r.headers.get('Content-Disposition')?.match(/filename="?([^"]+)"?/)?.[1]??'ondacast-unified.m3u';
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      exportOk=`Exported ~${playlists.reduce((s,p)=>s+(p.channelCount??0),0).toLocaleString()} channels`;
    } catch(e){exportError=`Export failed: ${(e as Error).message}`;}
    finally{exporting=false;}
  }

  // ── EPG (embedded data, no network) ──
  const EPG = [
    {id:1,owner:"Ferteque",service:"Strong 8k",countries:"Spain",categories:"Football and TV",clicks:5598},
    {id:2,owner:"jams",service:"Strong 8k",countries:"Canada,United Kingdom,United States",categories:"Live TV; Major Sports; PPV; Local Channels; 24/7",clicks:19125},
    {id:6,owner:"GanjaRelease",service:"Strong 8k",countries:"Australia,Canada,Ireland,New Zealand,United Kingdom,United States",categories:"100% EPG Coverage for Sports and Live TV",clicks:63922},
    {id:8,owner:"GanjaRelease",service:"Lion",countries:"United Kingdom,United States",categories:"TV Guide, Sports, Kids, NFL, NBA, MLB, NHL, Football, 24/7",clicks:2603},
    {id:9,owner:"GanjaRelease",service:"Trex",countries:"Canada,United Kingdom,United States",categories:"TV Guide (USA) NFL, NBA, MLB, College Football, Sky Sports",clicks:8442},
    {id:13,owner:"Ferteque",service:"Strong 8k",countries:"Brazil",categories:"Sports, Entertainment, Big Brother, Documentarios, Kids",clicks:1723},
    {id:14,owner:"tropaz",service:"Strong 8k",countries:"Ireland,United Kingdom,United States",categories:"Ireland,UK and USA TV, UK USA Sport, Irish Sports",clicks:1561},
    {id:15,owner:"tropaz",service:"Trex",countries:"Ireland,United Kingdom,United States",categories:"Ireland,UK and USA TV, UK USA Sport, Irish Sports",clicks:1886},
    {id:28,owner:"z06tim",service:"Eagle4k/Dream4k",countries:"Canada,United Kingdom,United States",categories:"Entertainment, Sports, PPV",clicks:2337},
    {id:29,owner:"z06tim",service:"B1G",countries:"Canada,United Kingdom,United States",categories:"Entertainment, Sports, PPV",clicks:1221},
    {id:31,owner:"Safinn",service:"Strong 8k",countries:"Cyprus,Greece",categories:"TV Guide (CY, GR)",clicks:224},
    {id:32,owner:"riaba-aggr",service:"Strong 8k",countries:"Austria,Germany,Switzerland",categories:"Complete German EPG, Magenta, JOYN, PRIME, sports",clicks:1494},
    {id:37,owner:"diZMunky",service:"Magnum/Golden",countries:"Antarctica,Australia,Austria,Canada,Germany,Ireland,New Zealand,Switzerland,United Kingdom,United States",categories:"US Sports (NFL,MLB,MLS,NHL,NBA,NCAA), Intl Sports (PPV,F1,EPL,UEFA)",clicks:1236},
    {id:38,owner:"Koalamanx",service:"Strong 8k",countries:"Austria,Germany,Switzerland",categories:"Premium Bundesliga 4K, DAZN, Sky, PPV+, General TV, JOYN",clicks:1146},
    {id:41,owner:"SemperSolus",service:"Dream 4k/Eagle 4k",countries:"Mexico,United Kingdom,United States",categories:"Spanish TV and Sports, US CA UK Sports, PPV",clicks:399},
    {id:42,owner:"Koalamanx",service:"Strong 8k",countries:"Caribbean LATAM,Portuguese LATAM,Spanish LATAM",categories:"LATAM Premium 4K/FHD, Deportes, Cine, Series",clicks:622},
    {id:43,owner:"gtbinh",service:"Strong 8k",countries:"Vietnam",categories:"Vietnam",clicks:65},
    {id:47,owner:"Pietro395",service:"Strong 8k",countries:"Italy",categories:"Live TV, Sport, Movies",clicks:21},
  ];
  interface EpgEntry { id:number; owner:string; service:string; countries:string; categories:string; clicks:number; sizeKB?:number; }
  let epgEntries = $state<EpgEntry[]>(EPG.map(e=>({...e})));
  let epgStatusMsg = $state('');
  let epgLoading = $state(false);
  let epgSyncing = $state(false);
  let epgSyncMsg = $state('');

  async function loadEpgStatus() {
    epgLoading = true;
    try {
      const r = await fetch('/api/epg/status');
      if (r.ok) {
        const d = await r.json();
        if (d.syncedAt) epgStatusMsg = 'Last sync: ' + new Date(d.syncedAt).toLocaleString();
        if (d.results) {
          const byId = new Map(d.results.map((r: { id: number; sizeKB?: number }) => [r.id, r]));
          epgEntries = epgEntries.map((e) => {
            const s = byId.get(e.id);
            if (s && s.sizeKB) return { ...e, sizeKB: s.sizeKB };
            return e;
          });
        }
      }
    } catch { /* ok */ }
    finally { epgLoading = false; }
  }

  async function triggerEpgSync() {
    epgSyncing = true;
    epgSyncMsg = '';
    try {
      const r = await fetch('/api/epg/sync', { method: 'POST' });
      const d = await r.json();
      if (d.ok || d.synced > 0) {
        if (d.results) {
          const byId = new Map(d.results.map((r: { id: number; sizeKB?: number }) => [r.id, r]));
          epgEntries = epgEntries.map((e) => {
            const s = byId.get(e.id);
            if (s && s.sizeKB) return { ...e, sizeKB: s.sizeKB };
            return e;
          });
        }
        epgSyncMsg = 'Synced ' + (d.synced ?? 0) + ' of ' + (d.results?.length ?? epgEntries.length) + ' playlists';
      } else {
        epgSyncMsg = d.error || 'Sync failed';
      }
    } catch (e) {
      epgSyncMsg = 'Error: ' + (e as Error).message;
    } finally {
      epgSyncing = false;
      setTimeout(() => (epgSyncMsg = ''), 6000);
    }
  }

  let copiedId=$state<number|null>(null);
  function copyUrl(id:number){navigator.clipboard.writeText(`https://admin.ondacast.com/api/epg/download/${id}`).then(()=>{copiedId=id;setTimeout(()=>copiedId=null,2000);});}

  let totalChannels=$derived(playlists.reduce((s,p)=>s+(p.channelCount??0),0));
  let epgSyncedCount=$derived(epgEntries.filter(e=>e.sizeKB).length);
</script>

<PageHead title="TV Playlists" sub={`${playlists.length} M3U and ${epgEntries.length} EPG`}>
  <Btn kind="primary" icon={Download} onclick={exportUnified} disabled={exporting||playlists.length===0}>{exporting?'Exporting…':'Export Unified M3U'}</Btn>
  <Btn icon={RefreshCw} onclick={()=>{loadPlaylists();loadEpgStatus();}} disabled={loading&&epgLoading}>{loading&&epgLoading?'Loading…':'Refresh'}</Btn>
</PageHead>

{#if exportError}<div class="banner banner-err" style="margin-top:16px">{exportError}</div>{/if}
{#if exportOk}<div class="banner banner-ok" style="margin-top:16px">{exportOk}</div>{/if}

<div class="panel" style="margin-top:20px">
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
    <PanelHead icon={Globe} title="EPG Repository" sub={`${epgEntries.length} playlists, ${epgSyncedCount} synced${epgStatusMsg?' — '+epgStatusMsg:''}`} />
    <div style="display:flex;align-items:center;gap:8px">
      {#if epgSyncMsg}<span class="sync-msg">{epgSyncMsg}</span>{/if}
      <Btn kind="primary" icon={RefreshCw} onclick={triggerEpgSync} disabled={epgSyncing}>{epgSyncing?'Syncing…':'Enrich EPG'}</Btn>
    </div>
  </div>
  <Table>
    <thead><tr><th>#</th><th>Owner / Service</th><th>Countries</th><th>Categories</th><th>Size</th><th>EPG URL</th></tr></thead>
    <tbody>
      {#each epgEntries as e}
        <tr>
          <td class="mono">{e.id}</td>
          <td><div style="font-weight:600">{e.owner}</div><div style="font-size:11px;color:var(--ink-faint)">{e.service}</div></td>
          <td style="font-size:11px;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title={e.countries}>{e.countries}</td>
          <td style="font-size:10px;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title={e.categories}>{e.categories}</td>
          <td class="mono" style="font-size:11px">{#if e.sizeKB}<Tag tone="" dot>{e.sizeKB.toFixed(0)} KB</Tag>{:else}—{/if}</td>
          <td><button class="url-copy-btn" onclick={()=>copyUrl(e.id)} title="Copy EPG URL">{#if copiedId===e.id}<Check size={14}/>{:else}<Copy size={14}/>{/if}<span class="mono" style="font-size:10px">epg{e.id}.xml</span></button></td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Radio} title="M3U Playlists" sub="User-added IPTV playlists" />
  {#if loading}<div style="padding:40px;text-align:center;color:var(--ink-faint)">Loading…</div>
  {:else if playlists.length===0}<div class="empty" style="padding:40px"><Radio size={32} style="color:var(--ink-faint)"/><h3>No TV playlists</h3><p>Add M3U playlists in OndaCast (TV — Manage Playlists).</p></div>
  {:else}
    <Table>
      <thead><tr><th>Name</th><th>Source</th><th style="text-align:right">Channels</th><th>Last Synced</th><th>Status</th></tr></thead>
      <tbody>
        {#each playlists as pl}
          <tr><td class="name">{pl.name}</td><td class="mono" style="font-size:11px;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{pl.url}</td><td class="mono" style="text-align:right">{pl.channelCount?.toLocaleString()??'—'}</td><td class="mono" style="font-size:11px">{pl.lastSyncedAt?new Date(pl.lastSyncedAt).toLocaleDateString():'Never'}</td><td><Tag tone={pl.visible?'':'muted'} dot>{pl.visible?'Active':'Hidden'}</Tag></td></tr>
        {/each}
      </tbody>
    </Table>
  {/if}
</div>

<style>
  .banner{padding:12px 16px;border-radius:8px;font-family:var(--font-mono,monospace);font-size:12px}
  .banner-err{background:rgba(255,90,60,0.12);color:#ff8a70;border:1px solid rgba(255,90,60,0.25)}
  .banner-ok{background:rgba(110,231,120,0.12);color:#6ee787;border:1px solid rgba(110,231,120,0.25)}
  .empty{text-align:center;color:var(--ink-faint)}
  .empty h3{margin:12px 0 4px;font-size:15px;color:var(--ink)}
  .empty p{font-size:13px}
  .url-copy-btn{display:inline-flex;align-items:center;gap:6px;background:var(--bg-2,#ecead9);border:1px solid var(--hair,#e3dfd0);border-radius:6px;padding:6px 10px;cursor:pointer;font-family:var(--font-mono,monospace);font-size:10px;color:var(--ink,#1a1814);transition:all 0.15s}
  .url-copy-btn:hover{background:var(--bg,#f6f4ef);border-color:var(--ink-3,#8a8678)}
  .sync-msg{font-size:12px;color:var(--ink-faint);max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
</style>
