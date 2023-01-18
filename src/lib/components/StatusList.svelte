<script lang="ts">
  import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';

  import Button from '@/ui/components/buttons/Button.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import { IconDiscover } from '@/ui/icons';
  import { Onyx } from '@/ui/services';

  import StatusItem from './StatusItem.svelte';

  export let queryKey: string = undefined;
  export let query: CreateInfiniteQueryResult<mastodon.v1.Status[]>;

  let loadMoreTitle: string;

  const keyMan = OnyxKeys.subscribe(
    {
      on2Long: async () => {
        $query.refetch();
        Onyx.toaster.show({ type: 'info', icon: IconDiscover, title: 'Refreshing...' });
      },
    },
    { priority: 3 },
  );

  $: if ($query.isFetching) {
    loadMoreTitle = 'Loading more...';
  } else if ($query.hasNextPage) {
    loadMoreTitle = 'Load more';
  } else {
    loadMoreTitle = 'End of list';
  }

  onDestroy(() => keyMan.unsubscribe());
</script>

{#if $query.isLoading}
  <Typography align="center">Loading...</Typography>
{/if}
{#if $query.error}
  <Typography align="center">Error!</Typography>
{/if}
{#if $query.isSuccess}
  {#each $query.data.pages as page, i}
    {#each page as status, j}
      {#if status.visibility === 'public' && !status.account.bot}
        <StatusItem {queryKey} {status} />
      {/if}
    {/each}
  {/each}
  <Button
    title={loadMoreTitle}
    disabled={!$query.hasNextPage || $query.isFetchingNextPage}
    navi={{
      itemId: 'STATUS_LOAD_MORE',
      onSelect: () => $query.fetchNextPage(),
    }}
  />
{/if}

<style global lang="postcss">
  .status-content > p:not(:first-child) {
    @apply mt-2;
  }
</style>
