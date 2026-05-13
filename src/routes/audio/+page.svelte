<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import Seg from '$lib/components/Seg.svelte';
  import { Signal } from 'lucide-svelte';

  let codec = $state('aac');
</script>

<PageHead title="Audio engine" sub="Stream proxy, codec defaults, and bitrate ladder." />

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Signal} title="Default codec" />
  <FormRow title="Codec" desc="Preferred encoding for transcoded streams">
    <Seg
      value={codec}
      options={[
        { value: 'aac', label: 'AAC' },
        { value: 'mp3', label: 'MP3' },
        { value: 'opus', label: 'Opus' },
      ]}
      onChange={(v: string) => (codec = v)}
    />
  </FormRow>
  <FormRow title="Default bitrate" desc="kbps for WEB streams without a known value">
    <Field>
      <input class="input mono" type="number" value="128" />
    </Field>
  </FormRow>
  <FormRow title="Max bitrate" desc="Ceiling for premium/lossless">
    <Field>
      <input class="input mono" type="number" value="320" />
    </Field>
  </FormRow>
</div>

<div class="panel" style="margin-top:20px">
  <PanelHead icon={Signal} title="Stream proxy" sub="Cache and relay configuration" />
  <FormRow title="Proxy enabled" desc="Relay streams through OndaCast edge">
    <Seg
      value="yes"
      options={[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ]}
      onChange={() => {}}
    />
  </FormRow>
  <FormRow title="Edge regions" desc="Comma-separated fly.io / CF regions">
    <Field>
      <input class="input mono" value="iad, ams, nrt" />
    </Field>
  </FormRow>
</div>
