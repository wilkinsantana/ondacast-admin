<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import { Settings } from 'lucide-svelte';

  let siteName = $state('OndaCast');
  let timezone = $state('UTC');
  let locale = $state('en-US');
  let notifyNewUser = $state(true);
  let notifyReport = $state(true);
</script>

<PageHead title="General settings" sub="Site identity, locale, and notifications." />

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Settings} title="Site identity" />
  <FormRow title="Site name" desc="Displayed in titles and emails">
    <Field>
      <input class="input" bind:value={siteName} />
    </Field>
  </FormRow>
  <FormRow title="Default timezone" desc="For scheduling and timestamps">
    <Field>
      <input class="input mono" bind:value={timezone} />
    </Field>
  </FormRow>
  <FormRow title="Default locale" desc="Date/number formatting">
    <Field>
      <input class="input mono" bind:value={locale} />
    </Field>
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Settings} title="Notifications" />
  <FormRow title="New user signup" desc="Alert on every new registration">
    <Switch bind:on={notifyNewUser} />
  </FormRow>
  <FormRow title="Station reported" desc="Alert when a station is flagged">
    <Switch bind:on={notifyReport} />
  </FormRow>
  <FormRow title="Payment failed" desc="Alert on failed subscription payments">
    <Switch on={true} />
  </FormRow>
</div>
