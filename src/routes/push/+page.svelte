<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import { Bell, Cloud } from 'lucide-svelte';
</script>

<PageHead title="Push &amp; media" sub="APNs, FCM, VAPID, and R2/S3 storage." />

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Bell} title="Apple Push (APNs)" />
  <FormRow title="Key ID" desc="From Apple Developer">
    <Field>
      <input class="input mono" value="ABC123DEF4" />
    </Field>
  </FormRow>
  <FormRow title="Team ID">
    <Field>
      <input class="input mono" value="8X9Y0Z1A2B" />
    </Field>
  </FormRow>
  <FormRow title="Topic" desc="Bundle ID">
    <Field>
      <input class="input mono" value="com.ondacast.app" />
    </Field>
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Cloud} title="Media storage (R2/S3)" />
  <FormRow title="Bucket" desc="R2 or S3 bucket name">
    <Field>
      <input class="input mono" value="ondacast-media-prod" />
    </Field>
  </FormRow>
  <FormRow title="Endpoint" desc="S3-compatible endpoint">
    <Field>
      <input class="input mono" value="https://xxx.r2.cloudflarestorage.com" />
    </Field>
  </FormRow>
  <FormRow title="Public CDN" desc="Cached public URL base">
    <Field>
      <input class="input mono" value="https://cdn.ondacast.com" />
    </Field>
  </FormRow>
</div>
