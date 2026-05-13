<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Podcast as PodcastIcon, Plus, RefreshCw } from 'lucide-svelte';
  import { getPodcasts } from '$lib/api/admin/podcasts';
  import type { Podcast } from '$lib/types/models';

  let list = $state<Podcast[]>([]);

  onMount(async () => {
    list = await getPodcasts();
  });
</script>

<PageHead title="Podcasts" sub={`${list.length} podcasts indexed`}>
  <Btn kind="primary" icon={Plus}>Add podcast</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Publisher</th>
        <th>Category</th>
        <th style="text-align:right">Episodes</th>
        <th style="text-align:right">Downloads</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each list as p}
        <tr>
          <td class="name">
            <PodcastIcon size={13} style="margin-right:6px" />
            {p.title}
          </td>
          <td>{p.publisher}</td>
          <td>{p.category}</td>
          <td class="mono" style="text-align:right">{p.episodes}</td>
          <td class="mono" style="text-align:right">{p.downloads?.toLocaleString() ?? 0}</td>
          <td><Tag tone={p.status === 'live' ? '' : ''}>{p.status ?? 'live'}</Tag></td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={RefreshCw}>Re-fetch RSS</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
