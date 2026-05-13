<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { Menu, Plus, GripHorizontal } from 'lucide-svelte';

  let headerNav = $state([
    { label: 'Home', href: '/' },
    { label: 'Stations', href: '/stations' },
    { label: 'Podcasts', href: '/podcasts' },
    { label: 'Audiobooks', href: '/audiobooks' },
    { label: 'Premium', href: '/premium' },
  ]);

  let footerNav = $state([
    { label: 'About', href: '/about' },
    { label: 'Help', href: '/help' },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Contact', href: '/contact' },
  ]);
</script>

<PageHead title="Navigation" sub="Edit header, footer, and mobile-tab navigation." />

<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px">
  <div class="panel">
    <PanelHead icon={Menu} title="Header" sub={`${headerNav.length} links`} />
    <div class="nav-editor">
      {#each headerNav as item}
        <div class="nav-row">
          <GripHorizontal size={12} style="color:var(--ink-faint);cursor:grab" />
          <span>{item.label}</span>
          <span class="mono" style="color:var(--ink-faint)">{item.href}</span>
        </div>
      {/each}
    </div>
    <div style="padding:12px">
      <Btn size="sm" kind="ghost" icon={Plus}>Add link</Btn>
    </div>
  </div>

  <div class="panel">
    <PanelHead icon={Menu} title="Footer" sub={`${footerNav.length} links`} />
    <div class="nav-editor">
      {#each footerNav as item}
        <div class="nav-row">
          <GripHorizontal size={12} style="color:var(--ink-faint);cursor:grab" />
          <span>{item.label}</span>
          <span class="mono" style="color:var(--ink-faint)">{item.href}</span>
        </div>
      {/each}
    </div>
    <div style="padding:12px">
      <Btn size="sm" kind="ghost" icon={Plus}>Add link</Btn>
    </div>
  </div>
</div>
