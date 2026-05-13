<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Palette, Check } from 'lucide-svelte';
  import { themes } from '$lib/mock/data';
  import type { ThemeItem } from '$lib/types/models';

  let list = $state<ThemeItem[]>([]);

  onMount(() => {
    list = themes;
  });
</script>

<PageHead title="Themes" sub={`${list.length} themes — ${list.filter((t) => t.active).length} active`}>
  <Btn kind="primary" icon={Palette}>Add theme</Btn>
</PageHead>

<div class="theme-grid" style="margin-top:20px">
  {#each list as theme}
    <div class="theme-card" class:active={!!theme.active}>
      <div class="theme-swatch">
        {#each theme.colors as c}
          <span class="theme-chip" style="background:{c}"></span>
        {/each}
      </div>
      <div class="theme-meta">
        <b>{theme.name}</b>
        {#if theme.active}
          <span style="color:var(--amber);font-size:11px;display:flex;align-items:center;gap:3px">
            <Check size={10} /> Active
          </span>
        {/if}
        <span class="id" style="font-size:10px">{theme.builtin ? 'Built-in' : 'Custom'}</span>
      </div>
    </div>
  {/each}
</div>
