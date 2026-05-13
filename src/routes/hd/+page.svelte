<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Signal, Plus } from 'lucide-svelte';
  import { stations } from '$lib/mock/data';
  import type { Station } from '$lib/types/models';

  let hdStations = $state<Station[]>([]);

  onMount(() => {
    hdStations = stations.filter((s) => s.hd);
  });
</script>

<PageHead title="HD subchannels" sub={`${hdStations.length} stations with HD`}>
  <Btn kind="primary" icon={Plus}>Add subchannel</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Station</th>
        <th>Band</th>
        <th>City</th>
        <th style="text-align:right">Bitrate</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each hdStations as s}
        <tr>
          <td class="name">
            <Signal size={13} style="margin-right:6px;color:var(--amber)" />
            {s.name}
            <span class="id" style="margin-left:6px">{s.call}</span>
          </td>
          <td>{s.band}{s.freq ? ` ${s.freq}` : ''}</td>
          <td>{s.city}, {s.country}</td>
          <td class="mono" style="text-align:right">{s.bitrate} kbps</td>
          <td><Tag tone={s.status === 'live' ? '' : ''} dot>{s.status ?? 'live'}</Tag></td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
