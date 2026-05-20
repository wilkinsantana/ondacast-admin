<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import Field from '$lib/components/Field.svelte';
  import FormRow from '$lib/components/FormRow.svelte';
  import Switch from '$lib/components/Switch.svelte';
  import Drawer from '$lib/components/Drawer.svelte';
  import { Megaphone, Plus, Pencil, Trash2, Calendar, Clock } from 'lucide-svelte';
  import {
    listAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
    type Announcement, type AnnouncementCreate
  } from '$lib/api/admin/announcements';

  let announcementList = $state<Announcement[]>([]);
  let loading = $state(true);
  let error = $state('');

  // Drawer state
  let drawerOpen = $state(false);
  let editingId = $state<number | null>(null);
  let formTitle = $state('');
  let formMessage = $state('');
  let formStyle = $state<Announcement['style']>('fade');
  let formColor = $state<Announcement['color_theme']>('yellow');
  let formTarget = $state<Announcement['target']>('all');
  let formPriority = $state(0);
  let formStartTime = $state('');
  let formEndTime = $state('');
  let formDismissible = $state(true);
  let formActive = $state(true);
  let saving = $state(false);
  let formError = $state('');

  onMount(() => loadList());

  async function loadList() {
    loading = true;
    error = '';
    try {
      announcementList = await listAnnouncements();
    } catch (e: unknown) {
      error = (e as Error).message || 'Failed to load announcements.';
    } finally {
      loading = false;
    }
  }

  function openCreate() {
    editingId = null;
    formTitle = '';
    formMessage = '';
    formStyle = 'fade';
    formColor = 'yellow';
    formTarget = 'all';
    formPriority = 0;
    formStartTime = '';
    formEndTime = '';
    formDismissible = true;
    formActive = true;
    formError = '';
    drawerOpen = true;
  }

  function openEdit(a: Announcement) {
    editingId = a.id;
    formTitle = a.title;
    formMessage = a.message;
    formStyle = a.style;
    formColor = a.color_theme;
    formTarget = a.target;
    formPriority = a.priority;
    formStartTime = a.start_time ? a.start_time.slice(0, 16) : '';
    formEndTime = a.end_time ? a.end_time.slice(0, 16) : '';
    formDismissible = a.is_dismissible;
    formActive = a.is_active;
    formError = '';
    drawerOpen = true;
  }

  async function handleSave() {
    if (!formTitle.trim() || !formMessage.trim()) {
      formError = 'Title and message are required.';
      return;
    }
    saving = true;
    formError = '';
    const data: AnnouncementCreate = {
      title: formTitle.trim(),
      message: formMessage.trim(),
      style: formStyle,
      color_theme: formColor,
      target: formTarget,
      priority: formPriority,
      start_time: formStartTime || null,
      end_time: formEndTime || null,
      is_dismissible: formDismissible,
      is_active: formActive,
    };
    try {
      if (editingId) {
        await updateAnnouncement(editingId, data);
      } else {
        await createAnnouncement(data);
      }
      drawerOpen = false;
      await loadList();
    } catch (e: unknown) {
      formError = (e as Error).message || 'Save failed.';
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this announcement?')) return;
    try {
      await deleteAnnouncement(id);
      await loadList();
    } catch (e: unknown) {
      error = (e as Error).message || 'Delete failed.';
    }
  }

  function formatTime(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso + (iso.endsWith('Z') ? '' : 'Z')).toLocaleString();
  }

  function isLive(a: Announcement): boolean {
    if (!a.is_active) return false;
    const now = Date.now();
    if (a.start_time && new Date(a.start_time).getTime() > now) return false;
    if (a.end_time && new Date(a.end_time).getTime() <= now) return false;
    return true;
  }

  function targetLabel(t: string): string {
    const map: Record<string, string> = { all: 'Everyone', logged_in: 'Users', guests: 'Guests', admin: 'Admins' };
    return map[t] ?? t;
  }
</script>

<PageHead title="Announcements" sub={`${announcementList.length} site-wide banners`}>
  <Btn kind="primary" icon={Plus} onclick={openCreate}>New announcement</Btn>
</PageHead>

{#if error}
  <div class="sign-in-error" style="margin-top:12px">{error}</div>
{/if}

{#if loading}
  <p style="color:var(--ink-dim);padding:40px 0">Loading&hellip;</p>
{:else if announcementList.length === 0}
  <div class="empty-state" style="margin-top:40px">
    <Megaphone size={32} style="color:var(--ink-faint)" />
    <p style="color:var(--ink-dim);margin-top:8px">No announcements yet.</p>
    <p style="color:var(--ink-dim);font-size:12px">Create one to send a site-wide message to your audience.</p>
  </div>
{:else}
  <div class="anno-list" style="margin-top:20px">
    {#each announcementList as a}
      <div class="anno-card" class:anno-inactive={!isLive(a)}>
        <div class="anno-left">
          <div class="anno-preview anno-preview-{a.color_theme}">
            <span class="anno-preview-title">{a.title}</span>
            <span class="anno-preview-msg">{a.message.slice(0, 80)}{a.message.length > 80 ? '…' : ''}</span>
          </div>
        </div>
        <div class="anno-meta">
          <span class="anno-badge">{targetLabel(a.target)}</span>
          <span class="anno-badge">{a.style}</span>
          <span class="anno-badge">{a.color_theme}</span>
          {#if !a.is_dismissible}
            <span class="anno-badge anno-permanent">Permanent</span>
          {/if}
          <span class="anno-badge" class:anno-live={isLive(a)} class:anno-off={!isLive(a)}>
            {isLive(a) ? 'Live' : a.is_active ? 'Scheduled' : 'Inactive'}
          </span>
          <span class="anno-time">
            <Clock size={10} />
            {#if a.start_time}
              {formatTime(a.start_time)}
            {:else}
              Immediate
            {/if}
            {#if a.end_time}
              &mdash; {formatTime(a.end_time)}
            {/if}
          </span>
        </div>
        <div class="anno-actions">
          <Btn kind="ghost" size="sm" icon={Pencil} onclick={() => openEdit(a)} />
          <Btn kind="ghost" size="sm" icon={Trash2} onclick={() => handleDelete(a.id)} />
        </div>
      </div>
    {/each}
  </div>
{/if}

<Drawer open={drawerOpen} onClose={() => (drawerOpen = false)} title={editingId ? 'Edit announcement' : 'New announcement'}>
  {#if formError}
    <div class="sign-in-error" style="margin-bottom:16px">{formError}</div>
  {/if}
  <div class="stack">
    <FormRow title="Title" desc="Short heading shown in bold">
      <input class="input" bind:value={formTitle} placeholder="e.g. Scheduled maintenance tonight" maxlength="200" />
    </FormRow>
    <FormRow title="Message" desc="Body text of the announcement">
      <textarea class="textarea" rows={3} bind:value={formMessage} placeholder="The full announcement body…" maxlength="2000"></textarea>
    </FormRow>
    <FormRow title="Display style">
      <select class="select" bind:value={formStyle}>
        <option value="fade">Fade in</option>
        <option value="typewriter">Typewriter</option>
        <option value="slide">Slide in</option>
        <option value="none">None (instant)</option>
      </select>
    </FormRow>
    <FormRow title="Color theme">
      <select class="select" bind:value={formColor}>
        <option value="yellow">Yellow</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="red">Red</option>
        <option value="purple">Purple</option>
        <option value="dark">Dark</option>
      </select>
    </FormRow>
    <FormRow title="Target audience" desc="Who sees this announcement">
      <select class="select" bind:value={formTarget}>
        <option value="all">Everyone</option>
        <option value="logged_in">Signed-in users</option>
        <option value="guests">Guests only</option>
        <option value="admin">Admins only</option>
      </select>
    </FormRow>
    <FormRow title="Priority" desc="Higher = shown first (0-100)">
      <input class="input mono" type="number" min="0" max="100" bind:value={formPriority} />
    </FormRow>
    <FormRow title="Start time" desc="Leave blank for immediate">
      <input class="input mono" type="datetime-local" bind:value={formStartTime} />
    </FormRow>
    <FormRow title="End time" desc="Leave blank for until-dismissed">
      <input class="input mono" type="datetime-local" bind:value={formEndTime} />
    </FormRow>
    <FormRow title="Dismissible" desc="Users can hide this announcement">
      <Switch bind:on={formDismissible} />
    </FormRow>
    <FormRow title="Active" desc="Show this announcement now">
      <Switch bind:on={formActive} />
    </FormRow>

    <!-- preview -->
    <div style="margin-top:8px">
      <span class="field-label" style="display:block;margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:var(--ink-dim)">Preview</span>
      <div class="anno-preview anno-preview-{formColor}" style="padding:10px 14px">
        <span class="anno-preview-title">{formTitle || 'Title preview'}</span>
        <span class="anno-preview-msg">{formMessage || 'Message preview…'}</span>
        {#if formDismissible}
          <span style="position:absolute;top:8px;right:12px;font-size:16px;opacity:0.4">&times;</span>
        {/if}
      </div>
    </div>
  </div>
  {#snippet footer()}
    <Btn kind="ghost" onclick={() => (drawerOpen = false)} disabled={saving}>Cancel</Btn>
    <Btn kind="primary" onclick={handleSave} disabled={saving}>
      {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create'}
    </Btn>
  {/snippet}
</Drawer>

<style>
  .anno-list { display: flex; flex-direction: column; gap: 10px; }

  .anno-card {
    display: flex; align-items: center; gap: 16px;
    background: var(--surface-panel); border: 1px solid var(--line);
    border-radius: 10px; padding: 14px 18px; transition: opacity 0.2s;
  }
  .anno-inactive { opacity: 0.5; }

  .anno-left { flex: 1; min-width: 0; }

  .anno-preview {
    position: relative; border-radius: 8px; padding: 8px 12px;
    font-size: 13px; line-height: 1.4;
  }
  .anno-preview-yellow { background: #fef9c3; color: #713f12; border: 1px solid #fde047; }
  .anno-preview-blue   { background: #dbeafe; color: #1e3a5f; border: 1px solid #93c5fd; }
  .anno-preview-green  { background: #dcfce7; color: #14532d; border: 1px solid #86efac; }
  .anno-preview-red    { background: #fee2e2; color: #7f1d1d; border: 1px solid #fca5a5; }
  .anno-preview-purple { background: #f3e8ff; color: #3b0764; border: 1px solid #c4b5fd; }
  .anno-preview-dark   { background: #1f2937; color: #f3f4f6; border: 1px solid #4b5563; }

  .anno-preview-title { display: block; font-weight: 600; font-size: 12px; opacity: 0.85; }
  .anno-preview-msg   { display: block; font-size: 12px; margin-top: 2px; }

  .anno-meta { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; flex-shrink: 0; }
  .anno-badge {
    font-size: 10px; padding: 2px 8px; border-radius: 10px;
    background: var(--line); color: var(--ink-mid);
    font-family: var(--font-mono); letter-spacing: 0.03em;
  }
  .anno-permanent { background: rgba(255,180,84,0.12); color: var(--amber); }
  .anno-live { background: rgba(122,212,138,0.12); color: var(--led-green); }
  .anno-off  { background: rgba(143,132,112,0.12); color: var(--ink-faint); }
  .anno-time { font-size: 10px; color: var(--ink-faint); display: flex; align-items: center; gap: 4px; }

  .anno-actions { display: flex; gap: 4px; flex-shrink: 0; }

  .empty-state { display: flex; flex-direction: column; align-items: center; text-align: center; }

  /* Form styles shared from admin panel */
  .stack { display: flex; flex-direction: column; gap: 20px; }
  .input, .textarea, .select {
    background: var(--surface-base); border: 1px solid var(--line);
    color: var(--ink); border-radius: 6px; padding: 8px 10px;
    font-family: var(--font-body); font-size: 13px; width: 100%;
  }
  .textarea { resize: vertical; }
  .select { cursor: pointer; }
  .mono { font-family: var(--font-mono); }
  .field-label { font-size: 13px; color: var(--ink); }

  .sign-in-error {
    background: rgba(255,122,92,0.1); border: 1px solid rgba(255,122,92,0.2);
    color: var(--led-red); padding: 10px 14px; border-radius: 8px;
    font-size: 13px;
  }
</style>
