<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';

  import StatusItem from '@/lib/components/StatusItem.svelte';
  import { masto } from '@/lib/services';
  import ListHeader from '@/ui/components/list/ListHeader.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { Layout } from '@/ui/enums';

  export let params: { id: string };

  const status = createQuery<mastodon.v1.Status>({
    queryKey: ['status', params.id],
    queryFn: async () => await $masto.v1.statuses.fetch(params.id),
  });

  const context = createQuery<mastodon.v1.Context>({
    queryKey: ['context', params.id],
    queryFn: async () => await $masto.v1.statuses.fetchContext(params.id),
  });
</script>

<View>
  <ViewHeader title="Status" showBack={true} />
  <ViewContent>
    {#if $status.isLoading}
      <Typography align="center">Loading Status...</Typography>
    {/if}
    {#if $status.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $status.isSuccess}
      <StatusItem sup={true} status={$status.data} />
    {/if}
    {#if $context.isLoading}
      <Typography align="center">Loading Replies...</Typography>
    {/if}
    {#if $context.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $context.isSuccess}
      {#if $context.data.descendants.length > 0}
        <ListHeader title="Replies" />
        {#each $context.data.descendants as reply}
          <StatusItem status={reply} sub={true} layout={Layout.Col} />
        {/each}
      {/if}
    {/if}
  </ViewContent>
</View>
