<script lang="ts">
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { HelpCircle, Plus, FileText, Search } from 'lucide-svelte';

  let articles = $state([
    { title: 'Getting started with OndaCast', category: 'Basics', views: 1240 },
    { title: 'How to add a station to favorites', category: 'Basics', views: 890 },
    { title: 'Understanding HD subchannels', category: 'Features', views: 567 },
    { title: 'Offline listening explained', category: 'Features', views: 432 },
    { title: 'Managing your subscription', category: 'Billing', views: 721 },
    { title: 'Passkey setup guide', category: 'Account', views: 310 },
    { title: 'Troubleshooting stream issues', category: 'Help', views: 654 },
    { title: 'Privacy & data FAQ', category: 'Account', views: 298 },
  ]);

  let categories = $derived([...new Set(articles.map((a) => a.category))]);
</script>

<PageHead title="Help center" sub={`${articles.length} articles across ${categories.length} categories`}>
  <Btn kind="primary" icon={Plus}>New article</Btn>
</PageHead>

<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px">
  {#each categories as cat}
    <div class="panel">
      <PanelHead icon={FileText} title={cat} sub={`${articles.filter((a) => a.category === cat).length} articles`} />
      <table class="tbl">
        <tbody>
          {#each articles.filter((a) => a.category === cat) as a}
            <tr>
              <td class="name">{a.title}</td>
              <td class="mono" style="text-align:right">
                <Search size={11} style="margin-right:4px;vertical-align:middle" />
                {a.views.toLocaleString()}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/each}
</div>
