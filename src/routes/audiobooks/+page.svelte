<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { BookOpen, Plus, RefreshCw, Upload } from 'lucide-svelte';
  import { getAudiobooks } from '$lib/api/admin/audiobooks';
  import type { Audiobook } from '$lib/types/models';

  let list = $state<Audiobook[]>([]);

  onMount(async () => {
    list = await getAudiobooks();
  });
</script>

<PageHead title="Audiobooks" sub={`${list.length} titles`}>
  <Btn kind="primary" icon={Plus}>Add audiobook</Btn>
  <Btn icon={Upload}>OPDS import</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Narrator</th>
        <th>Genre</th>
        <th style="text-align:right">Ch.</th>
        <th style="text-align:right">Hrs</th>
        <th style="text-align:right">Owned</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each list as b}
        <tr>
          <td class="name">
            <BookOpen size={13} style="margin-right:6px" />
            {b.title}
          </td>
          <td>{b.author}</td>
          <td>{b.narrator}</td>
          <td>{b.genre}</td>
          <td class="mono" style="text-align:right">{b.chapters}</td>
          <td class="mono" style="text-align:right">{b.hours}h</td>
          <td class="mono" style="text-align:right">{b.owned?.toLocaleString() ?? 0}</td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={RefreshCw}>Re-index</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
