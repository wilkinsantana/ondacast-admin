<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Megaphone } from 'lucide-svelte';
</script>

<PageHead title="Marketing copy" sub="Hero headline, feature bullets, and app store copy." />

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Megaphone} title="Hero section" sub="Landing page above the fold" />
  <FormRow title="Headline" desc="Main value proposition">
    <Field>
      <input class="input" value="Radio from everywhere, for everyone." />
    </Field>
  </FormRow>
  <FormRow title="Subheadline" desc="Supporting sentence">
    <Field>
      <input class="input" value="Thousands of live stations, podcasts, and audiobooks — ad-free, on your terms." />
    </Field>
  </FormRow>
  <FormRow title="CTA label" desc="Call to action button">
    <Field>
      <input class="input" value="Try OndaCast free" />
    </Field>
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Megaphone} title="Feature highlights" sub="Three-column feature grid" />
  {#each ['Ad-free listening', 'HD subchannels', 'Offline podcasts'] as feat, i}
    <FormRow title="Feature {i + 1}" desc="Title + short description">
      <Field>
        <input class="input" value={feat} />
      </Field>
    </FormRow>
  {/each}
</div>
