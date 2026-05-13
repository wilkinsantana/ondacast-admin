<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import Kpi from '$lib/components/Kpi.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import { Mail, Check, Shield } from 'lucide-svelte';
</script>

<PageHead title="Email / SMTP" sub="Outbound email provider and DKIM/SPF health." />

<div class="kpi-strip">
  <Kpi label="DKIM" value="Valid" color="var(--led-green)" icon={Check} />
  <Kpi label="SPF" value="Valid" color="var(--led-green)" icon={Check} />
  <Kpi label="DMARC" value="p=none" color="var(--amber)" icon={Shield} />
  <Kpi label="Deliverability" value="98.4%" color="var(--led-green)" icon={Mail} />
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Mail} title="Provider" sub="SMTP relay configuration" />
  <FormRow title="Provider" desc="Mailgun, SendGrid, SES, or SMTP">
    <Field>
      <input class="input" value="mailgun" />
    </Field>
  </FormRow>
  <FormRow title="API key" desc="Last rotated 2 days ago">
    <Field>
      <input class="input mono" type="password" value="key-••••••••••••••••" />
    </Field>
  </FormRow>
  <FormRow title="From address" desc="Transactional email sender">
    <Field>
      <input class="input mono" value="noreply@ondacast.com" />
    </Field>
  </FormRow>
  <FormRow title="From name" desc="Display name in inbox">
    <Field>
      <input class="input" value="OndaCast" />
    </Field>
  </FormRow>
</div>
