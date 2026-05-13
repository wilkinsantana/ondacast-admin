<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { FileText, Plus, Edit } from 'lucide-svelte';
  import { pages } from '$lib/mock/data';
  import type { PageItem } from '$lib/types/models';

  let list = $state<PageItem[]>([]);

  onMount(() => {
    list = pages;
  });
</script>

<PageHead title="Pages" sub={`${list.length} pages`}>
  <Btn kind="primary" icon={Plus}>New page</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Slug</th>
        <th>Updated</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each list as p}
        <tr>
          <td class="name">
            <FileText size={13} style="margin-right:6px" />
            {p.title}
          </td>
          <td class="mono">{p.slug}</td>
          <td class="mono">{p.updated}</td>
          <td><Tag tone={p.status === 'published' ? '' : ''}>{p.status}</Tag></td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={Edit}>Edit</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
