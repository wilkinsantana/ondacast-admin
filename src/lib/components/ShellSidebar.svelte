<script lang="ts">
  import { NAV, type NavEntry } from '$lib/nav';
  import { Bell } from 'lucide-svelte';

  interface Props {
    active: string;
    onNav: (id: string) => void;
  }

  let { active, onNav }: Props = $props();
</script>

<aside class="side">
  <div class="side-brand">
    <span class="mark"></span>
    <span class="title">OndaCast</span>
    <span class="tag">ADMIN</span>
  </div>
  <div class="side-scroll">
    {#each NAV as group}
      <div>
        <div class="side-group">{group.group}</div>
        {#each group.items as it}
          <button
            class="side-item"
            class:active={active === it.id}
            onclick={() => onNav(it.id)}
          >
            <span class="ico"><it.icon size={14} /></span>
            <span>{it.label}</span>
            {#if it.badge}
              <span class="badge {it.badge.tone}">{it.badge.text}</span>
            {/if}
          </button>
        {/each}
      </div>
    {/each}
  </div>
  <div class="side-footer">
    <span class="led"></span>
    <span>API &middot; api.ondacast.com</span>
  </div>
</aside>
