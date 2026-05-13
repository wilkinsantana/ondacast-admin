<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import { Music, Database, RefreshCw, Globe } from 'lucide-svelte';

  let cacheTtl = $state('30');
  let coverFetch = $state(true);
  let lyricFetch = $state(false);
</script>

<PageHead title="Now-playing metadata" sub="Configure metadata resolver chain and cache." />

<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px">
  <div class="panel">
    <PanelHead icon={Database} title="Cache" sub="Metadata freshness" />
    <FormRow title="TTL (seconds)" desc="How long before refetching">
      <Field>
        <input class="input mono" type="number" bind:value={cacheTtl} placeholder="30" />
      </Field>
    </FormRow>
    <FormRow title="Cover art" desc="Fetch album art from MusicBrainz/iTunes">
      <Switch bind:on={coverFetch} />
    </FormRow>
    <FormRow title="Lyrics" desc="Fetch synced lyrics where available">
      <Switch bind:on={lyricFetch} />
    </FormRow>
  </div>

  <div class="panel">
    <PanelHead icon={RefreshCw} title="Resolver chain" sub="Ordered metadata sources" />
    <div class="resolver-list">
      <div class="resolver-item"><span class="grip">::</span> Icecast/Shoutcast headers</div>
      <div class="resolver-item"><span class="grip">::</span> Radio-browser.info</div>
      <div class="resolver-item"><span class="grip">::</span> MusicBrainz</div>
      <div class="resolver-item"><span class="grip">::</span> iTunes Search API</div>
      <div class="resolver-item"><span class="grip">::</span> Spotify Web API</div>
    </div>
  </div>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Globe} title="Stats" sub="Last 24 hours" />
  <div class="kpi-strip">
    <div class="kpi">
      <span class="kpi-label">Resolved</span>
      <span class="kpi-value">48.2k</span>
    </div>
    <div class="kpi">
      <span class="kpi-label">Cache hits</span>
      <span class="kpi-value">87%</span>
    </div>
    <div class="kpi">
      <span class="kpi-label">Avg latency</span>
      <span class="kpi-value">42<span class="unit">ms</span></span>
    </div>
  </div>
</div>
