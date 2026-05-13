<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Tags, Plus } from 'lucide-svelte';

  let genres = $state(['Indie', 'Alternative', 'Eclectic', 'Public', 'World', 'Jazz', 'Electronic', 'Underground', 'Lo-fi', 'Classical', 'Hip-Hop', 'Folk']);
  let locations = $state(['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania']);
  let languages = $state(['English', 'Spanish', 'French', 'Japanese', 'German', 'Portuguese', 'Korean', 'Italian']);
</script>

<PageHead title="Categories" sub="Manage genres, regions, and language taxonomies." />

<div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px; margin-top:20px">
  <div class="panel">
    <PanelHead icon={Tags} title="Genres" sub={`${genres.length} items`} />
    <div style="display:flex;flex-wrap:wrap;gap:6px;padding:12px">
      {#each genres as g}
        <Tag>{g}</Tag>
      {/each}
    </div>
    <div style="padding:0 12px 12px">
      <Btn size="sm" kind="ghost" icon={Plus}>Add genre</Btn>
    </div>
  </div>

  <div class="panel">
    <PanelHead icon={Tags} title="Regions" sub={`${locations.length} items`} />
    <div style="display:flex;flex-wrap:wrap;gap:6px;padding:12px">
      {#each locations as l}
        <Tag tone="amber">{l}</Tag>
      {/each}
    </div>
    <div style="padding:0 12px 12px">
      <Btn size="sm" kind="ghost" icon={Plus}>Add region</Btn>
    </div>
  </div>

  <div class="panel">
    <PanelHead icon={Tags} title="Languages" sub={`${languages.length} items`} />
    <div style="display:flex;flex-wrap:wrap;gap:6px;padding:12px">
      {#each languages as l}
        <Tag tone="">{l}</Tag>
      {/each}
    </div>
    <div style="padding:0 12px 12px">
      <Btn size="sm" kind="ghost" icon={Plus}>Add language</Btn>
    </div>
  </div>
</div>
