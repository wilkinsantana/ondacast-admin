<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import Field from '$lib/components/Field.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import Drawer from '$lib/components/Drawer.svelte';
  import { Package, Check, Plus, Pencil, Trash2 } from 'lucide-svelte';
  import { getPlans, createPlan, updatePlan, deletePlan } from '$lib/api/admin/plans';
  import type { Plan } from '$lib/types/models';

  let planList = $state<Plan[]>([]);
  let loading = $state(true);
  let error = $state('');

  // Drawer state
  let drawerOpen = $state(false);
  let editingId = $state<string | null>(null);
  let formId = $state('');
  let formName = $state('');
  let formPrice = $state(0);
  let formPeriod = $state<'mo' | 'yr'>('mo');
  let formTrial = $state(0);
  let formAudience = $state('');
  let formFeatured = $state(false);
  let formFeatures = $state('');
  let saving = $state(false);
  let formError = $state('');

  onMount(() => loadPlans());

  async function loadPlans() {
    loading = true;
    error = '';
    try {
      planList = await getPlans();
    } catch (e: unknown) {
      error = (e as Error).message || 'Failed to load plans.';
    } finally {
      loading = false;
    }
  }

  function openCreate() {
    editingId = null;
    formId = '';
    formName = '';
    formPrice = 0;
    formPeriod = 'mo';
    formTrial = 0;
    formAudience = '';
    formFeatured = false;
    formFeatures = '';
    formError = '';
    drawerOpen = true;
  }

  function openEdit(p: Plan) {
    editingId = p.id;
    formId = p.id;
    formName = p.name;
    formPrice = p.price;
    formPeriod = (p.period as 'mo' | 'yr') || 'mo';
    formTrial = p.trial;
    formAudience = p.audience;
    formFeatured = !!p.featured;
    formFeatures = (p.features || []).join('\n');
    formError = '';
    drawerOpen = true;
  }

  async function handleSave() {
    if (!formId.trim() || !formName.trim()) {
      formError = 'ID and name are required.';
      return;
    }
    saving = true;
    formError = '';
    const features = formFeatures
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const data = {
      id: formId.trim(),
      name: formName.trim(),
      price: formPrice,
      period: formPeriod,
      trial: formTrial,
      audience: formAudience.trim(),
      featured: formFeatured,
      features,
    };
    try {
      if (editingId) {
        await updatePlan(editingId, data);
      } else {
        await createPlan(data);
      }
      drawerOpen = false;
      await loadPlans();
    } catch (e: unknown) {
      formError = (e as Error).message || 'Save failed.';
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete plan "${id}"?`)) return;
    try {
      await deletePlan(id);
      await loadPlans();
    } catch (e: unknown) {
      error = (e as Error).message || 'Delete failed.';
    }
  }
</script>

<PageHead title="Plans / Packages" sub={`${planList.length} subscription tiers`}>
  <Btn kind="primary" icon={Plus} onclick={openCreate}>Add plan</Btn>
</PageHead>

{#if error}
  <div class="sign-in-error" style="margin-top:12px">{error}</div>
{/if}

{#if loading}
  <p style="color:var(--ink-dim);padding:40px 0">Loading&hellip;</p>
{:else}
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
        <div style="display:flex;gap:6px;margin-top:auto;justify-content:flex-end">
          <Btn kind="ghost" size="sm" icon={Pencil} onclick={() => openEdit(plan)} />
          <Btn kind="ghost" size="sm" icon={Trash2} onclick={() => handleDelete(plan.id)} />
        </div>
      </div>
    {/each}
  </div>
{/if}

<Drawer open={drawerOpen} onClose={() => (drawerOpen = false)} title={editingId ? `Edit ${editingId}` : 'New plan'}>
  {#if formError}
    <div class="sign-in-error" style="margin-bottom:16px">{formError}</div>
  {/if}
  <div class="stack">
    <FormRow title="Plan ID" desc="Lowercase slug, e.g. 'pro' or 'enterprise'">
      <input class="input mono" bind:value={formId} placeholder="plus" disabled={!!editingId} />
    </FormRow>
    <FormRow title="Display name">
      <input class="input" bind:value={formName} placeholder="Plus" />
    </FormRow>
    <FormRow title="Price" desc="In dollars (0 = free)">
      <input class="input mono" type="number" min="0" step="0.01" bind:value={formPrice} />
    </FormRow>
    <FormRow title="Period">
      <select class="select" bind:value={formPeriod}>
        <option value="mo">Monthly</option>
        <option value="yr">Yearly</option>
      </select>
    </FormRow>
    <FormRow title="Trial days" desc="0 for no trial">
      <input class="input mono" type="number" min="0" bind:value={formTrial} />
    </FormRow>
    <FormRow title="Audience label" desc='e.g. "Daily listener"'>
      <input class="input" bind:value={formAudience} placeholder="Daily listener" />
    </FormRow>
    <FormRow title="Features" desc="One per line">
      <textarea class="textarea" rows={5} bind:value={formFeatures} placeholder="Ad-free&#10;HD subchannels&#10;Offline podcasts"></textarea>
    </FormRow>
    <FormRow title="Featured" desc="Highlight this plan on marketing pages">
      <Switch bind:on={formFeatured} />
    </FormRow>
  </div>
  {#snippet footer()}
    <Btn kind="ghost" onclick={() => (drawerOpen = false)} disabled={saving}>Cancel</Btn>
    <Btn kind="primary" onclick={handleSave} disabled={saving}>
      {saving ? 'Saving&hellip;' : editingId ? 'Save changes' : 'Create plan'}
    </Btn>
  {/snippet}
</Drawer>
