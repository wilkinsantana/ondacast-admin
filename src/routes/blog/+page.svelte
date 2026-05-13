<script lang="ts">
  import { onMount } from 'svelte';
  import PageHead from '$lib/components/PageHead.svelte';
  import Table from '$lib/components/Table.svelte';
  import Tag from '$lib/components/Tag.svelte';
  import Btn from '$lib/components/Btn.svelte';
  import { FileEdit, Plus, Edit } from 'lucide-svelte';
  import { blogPosts } from '$lib/mock/data';
  import type { BlogPost } from '$lib/types/models';

  let list = $state<BlogPost[]>([]);

  onMount(() => {
    list = blogPosts;
  });
</script>

<PageHead title="Blog" sub={`${list.length} posts`}>
  <Btn kind="primary" icon={Plus}>New post</Btn>
</PageHead>

<div class="panel" style="margin-top:20px">
  <Table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Tags</th>
        <th>Status</th>
        <th style="text-align:right">Date</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each list as post}
        <tr>
          <td class="name">
            <FileEdit size={13} style="margin-right:6px" />
            {post.title}
          </td>
          <td>{post.author}</td>
          <td>
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              {#each (post.tags ?? []) as t}
                <Tag>{t}</Tag>
              {/each}
            </div>
          </td>
          <td><Tag tone={post.status === 'published' ? '' : ''}>{post.status}</Tag></td>
          <td class="mono" style="text-align:right">{post.date}</td>
          <td class="actions">
            <Btn size="sm" kind="ghost" icon={Edit}>Edit</Btn>
          </td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
