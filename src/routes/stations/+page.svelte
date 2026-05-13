<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import Drawer from '$lib/components/Drawer.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Field from '$lib/components/Field.svelte';
  import Seg from '$lib/components/Seg.svelte';
  import LogoTile from '$lib/components/LogoTile.svelte';
  import { RadioTower, Plus, Upload, Filter } from 'lucide-svelte';
  import { getStations } from '$lib/api/admin/stations';
  import type { Station } from '$lib/types/models';

  let list = $state<Station[]>([]);
  let drawerOpen = $state(false);
  let filterBand = $state('all');

  onMount(async () => {
    list = await getStations();
  });

  let filtered = $derived(
    filterBand === 'all' ? list : list.filter((s) => s.band === filterBand)
  );

  let fmCount = $derived(list.filter((s) => s.band === 'FM').length);
  let webCount = $derived(list.filter((s) => s.band === 'WEB').length);
  let amCount = $derived(list.filter((s) => s.band === 'AM').length);
</script>

<PageHead title="Radio stations" sub={`${list.length} stations in the catalog`}>
  <Btn kind="primary" icon={Plus} onclick={() => (drawerOpen = true)}>Add station</Btn>
  <Btn icon={Upload}>CSV import</Btn>
</PageHead>

<div style="margin-top:20px">
  <Seg
    value={filterBand}
    options={[
      { value: 'all', label: `All (${list.length})` },
      { value: 'FM', label: `FM (${fmCount})` },
      { value: 'WEB', label: `Web (${webCount})` },
      { value: 'AM', label: `AM (${amCount})` },
    ]}
    onChange={(v: string) => (filterBand = v)}
  />
</div>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Station</th>
        <th>Band</th>
        <th>City</th>
        <th>Category</th>
        <th style="text-align:right">Listeners</th>
        <th>Status</th>
        <th style="text-align:right">Bitrate</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as s}
        <tr>
          <td class="name">
            <LogoTile glyph={s.call?.charAt(0) ?? '?'} hue={s.hue ?? 30} size={26} />
            <span style="margin-left:8px">{s.name}</span>
            <span class="id" style="margin-left:6px">{s.call}</span>
          </td>
          <td>{s.band}{s.freq ? ` ${s.freq}` : ''}</td>
          <td>{s.city}, {s.country}</td>
          <td>{s.category}</td>
          <td class="mono" style="text-align:right">{s.listeners?.toLocaleString() ?? 0}</td>
          <td>
            <Tag tone={s.status === 'live' ? '' : s.status === 'degraded' ? 'amber' : ''} dot>
              {s.status ?? 'offline'}
            </Tag>
          </td>
          <td class="mono" style="text-align:right">{s.bitrate} kbps</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>

<Drawer open={drawerOpen} onClose={() => (drawerOpen = false)} title="Add station">
  <FormRow title="Call sign" desc="Official broadcast call letters">
    <Field>
      <input class="input mono" placeholder="e.g. KEXP" />
    </Field>
  </FormRow>
  <FormRow title="Name" desc="Display name">
    <Field>
      <input class="input" placeholder="Station name" />
    </Field>
  </FormRow>
  <FormRow title="Band &amp; frequency" desc="FM, AM, Web, or NOAA">
    <Field>
      <input class="input mono" placeholder="Band" />
    </Field>
  </FormRow>
  {#snippet footer()}
    <Btn kind="ghost" onclick={() => (drawerOpen = false)}>Cancel</Btn>
    <Btn kind="primary">Save</Btn>
  {/snippet}
</Drawer>
