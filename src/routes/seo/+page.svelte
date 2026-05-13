<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import Kpi from '$lib/components/Kpi.svelte';
  import { Search, Globe, FileText } from 'lucide-svelte';
</script>

<PageHead title="SEO &amp; meta" sub="Search engine settings, sitemap, and robots.txt." />

<div class="kpi-strip">
  <Kpi label="Indexed pages" value="42" icon={Search} />
  <Kpi label="Sitemap size" value="68" unit="URLs" icon={FileText} />
  <Kpi label="GSC health" value="Good" icon={Globe} color="var(--led-green)" />
</div>

<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px">
  <div class="panel">
    <PanelHead icon={Globe} title="Defaults" />
    <FormRow title="Title template" desc="&#123;page&#125; &mdash; OndaCast">
      <Field>
        <input class="input mono" value="&#123;page&#125; — OndaCast" />
      </Field>
    </FormRow>
    <FormRow title="Meta description" desc="Fallback description">
      <Field>
        <textarea class="input" rows={3}>Live radio from around the world. Discover stations, podcasts, and audiobooks.</textarea>
      </Field>
    </FormRow>
    <FormRow title="Canonical domain" desc="Force www or bare">
      <Field>
        <input class="input mono" value="ondacast.com" />
      </Field>
    </FormRow>
  </div>

  <div class="panel">
    <PanelHead icon={FileText} title="Sitemap &amp; robots" />
    <FormRow title="Auto-generate sitemap" desc="Rebuilds on content change">
      <Switch on={true} />
    </FormRow>
    <FormRow title="Include podcasts" desc="Add podcast detail pages">
      <Switch on={true} />
    </FormRow>
    <FormRow title="Lastmod from updated_at" desc="Use DB timestamps">
      <Switch on={true} />
    </FormRow>
  </div>
</div>
