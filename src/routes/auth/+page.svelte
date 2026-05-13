<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import { Shield } from 'lucide-svelte';
</script>

<PageHead title="Auth &amp; security" sub="Passkey, magic link, session, and rate-limit policies." />

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Shield} title="Passkey" sub="WebAuthn / FIDO2 settings" />
  <FormRow title="Allow passkey sign-in" desc="Platform authenticators (Face ID, Touch ID)">
    <Switch on={true} />
  </FormRow>
  <FormRow title="Require passkey for admin" desc="Admins must use passkey, not magic link">
    <Switch on={true} />
  </FormRow>
  <FormRow title="Allow security keys" desc="USB / NFC roaming authenticators">
    <Switch on={true} />
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Shield} title="Magic link" />
  <FormRow title="Magic link expiry" desc="Minutes before link expires">
    <Field>
      <input class="input mono" type="number" value="15" />
    </Field>
  </FormRow>
  <FormRow title="Rate limit per email" desc="Max requests per 15 min">
    <Field>
      <input class="input mono" type="number" value="3" />
    </Field>
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Shield} title="Sessions" />
  <FormRow title="Idle timeout" desc="Minutes before auto sign-out">
    <Field>
      <input class="input mono" type="number" value="60" />
    </Field>
  </FormRow>
  <FormRow title="Max concurrent sessions" desc="Per user">
    <Field>
      <input class="input mono" type="number" value="10" />
    </Field>
  </FormRow>
</div>
