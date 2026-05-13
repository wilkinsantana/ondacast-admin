<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Image, Upload } from 'lucide-svelte';
</script>

<PageHead title="Logos &amp; favicon" sub="Upload brand assets for web, app, and marketing." />

<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px">
  <div class="panel">
    <PanelHead icon={Image} title="Wordmark" sub="Light variant for dark backgrounds" />
    <div class="upload-slot">
      <Upload size={20} style="color:var(--ink-faint)" />
      <span style="color:var(--ink-faint);font-size:12px">Drop SVG or PNG (max 200 KB)</span>
      <Btn size="sm">Upload</Btn>
    </div>
  </div>
  <div class="panel">
    <PanelHead icon={Image} title="Glyph / icon" sub="App icon and favicon" />
    <div class="upload-slot">
      <Upload size={20} style="color:var(--ink-faint)" />
      <span style="color:var(--ink-faint);font-size:12px">Drop SVG or PNG (max 100 KB)</span>
      <Btn size="sm">Upload</Btn>
    </div>
  </div>
  <div class="panel">
    <PanelHead icon={Image} title="Favicon" sub=".ico or multiple sizes" />
    <div class="upload-slot">
      <Upload size={20} style="color:var(--ink-faint)" />
      <span style="color:var(--ink-faint);font-size:12px">Drop .ico or 32/48/64 PNGs</span>
      <Btn size="sm">Upload</Btn>
    </div>
  </div>
  <div class="panel">
    <PanelHead icon={Image} title="Marketing imagery" sub="Hero, OG, and email header" />
    <div class="upload-slot">
      <Upload size={20} style="color:var(--ink-faint)" />
      <span style="color:var(--ink-faint);font-size:12px">Drop PNG/JPG (max 2 MB)</span>
      <Btn size="sm">Upload</Btn>
    </div>
  </div>
</div>
