<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import PanelHead from '$lib/components/PanelHead.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import { Package, Check, Plus } from 'lucide-svelte';
  import { plans } from '$lib/mock/data';
  import type { Plan } from '$lib/types/models';

  let planList = $state<Plan[]>([]);

  onMount(() => {
    planList = plans;
  });
</script>

<PageHead title="Plans / Packages" sub={`${planList.length} subscription tiers`}>
  <Btn kind="primary" icon={Plus}>Add plan</Btn>
</PageHead>

<div class="plan-grid" style="margin-top:20px">
  {#each planList as plan}
    <div class="plan-card" class:featured={!!plan.featured}>
      <div class="plan-head">
        <b>{plan.name}</b>
        <span class="plan-price">
          {plan.price === 0 ? 'Free' : `$${plan.price}`}
          {#if plan.price > 0}<span class="unit">/{plan.period}</span>{/if}
        </span>
        <span class="plan-audience">{plan.audience}</span>
      </div>
      <div class="plan-features">
        {#each plan.features as f}
          <span class="plan-feat"><Check size={11} style="color:var(--led-green)" /> {f}</span>
        {/each}
      </div>
      {#if plan.trial}
        <div class="plan-trial">{plan.trial}-day free trial</div>
      {/if}
    </div>
  {/each}
</div>
