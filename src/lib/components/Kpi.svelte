<script lang="ts">
  import Spark from './Spark.svelte';
  import { ChevronUp, ChevronDown } from 'lucide-svelte';

  interface Props {
    label: string;
    value: string | number;
    unit?: string | null;
    trend?: string | null;
    dir?: 'up' | 'down' | 'flat';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: any;
    sparkData?: number[];
    color?: string;
  }

  let { label, value, unit = null, trend = null, dir = 'flat', icon: Icon, sparkData = [], color = 'var(--ink)' }: Props = $props();
</script>

<article class="kpi">
  <span class="kpi-label">
    {#if Icon}<span class="ico-svg"><Icon size={11} /></span>{/if}
    {label}
  </span>
  <span class="kpi-value" style="color:{color}">
    {value}
    {#if unit}<span class="unit">{unit}</span>{/if}
  </span>
  {#if trend}
    <span class="kpi-trend {dir}">
      {#if dir === 'up'}<ChevronUp size={11} />{:else if dir === 'down'}<ChevronDown size={11} />{/if}
      {trend}
      {#if sparkData.length > 0}
        <span style="margin-left:auto"><Spark data={sparkData} /></span>
      {/if}
    </span>
  {/if}
</article>
