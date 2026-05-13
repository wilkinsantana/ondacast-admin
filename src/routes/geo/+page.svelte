<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import { Globe } from 'lucide-svelte';
</script>

<PageHead title="Geo &amp; data feeds" sub="Configure radio-browser, NOAA, MaxMind, and Podcast Index." />

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Globe} title="radio-browser.info" sub="Community radio directory" />
  <FormRow title="Sync enabled" desc="Auto-pull station list daily">
    <Switch on={true} />
  </FormRow>
  <FormRow title="Mirror URL" desc="API base">
    <Field>
      <input class="input mono" value="https://de1.api.radio-browser.info" />
    </Field>
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Globe} title="NOAA Weather Radio" />
  <FormRow title="Ingest NOAA streams" desc="US NWR stations from weather.gov">
    <Switch on={true} />
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Globe} title="MaxMind GeoIP" sub="City/country detection for geo-blocking" />
  <FormRow title="License key">
    <Field>
      <input class="input mono" type="password" value="••••••••••••" />
    </Field>
  </FormRow>
  <FormRow title="Auto-update database" desc="Weekly GeoLite2 refresh">
    <Switch on={true} />
  </FormRow>
</div>
