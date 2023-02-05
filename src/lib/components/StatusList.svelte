<script lang="ts">
  import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';

  import Button from '@/ui/components/buttons/Button.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import { IconDiscover } from '@/ui/icons';
  import { Onyx } from '@/ui/services';

  import { settings } from '../stores';
  import StatusItem from './StatusItem.svelte';

  export let queryKey: string = undefined;
  export let query: CreateInfiniteQueryResult<IteratorResult<mastodon.v1.Status[]>>;
  // Hack: convert to IteratorReturnResult so later types are working correctly.
  const q = query as CreateInfiniteQueryResult<IteratorReturnResult<mastodon.v1.Status[]>>;

  let loadMoreTitle: string;

  const keyMan = OnyxKeys.subscribe(
    {
      on2Long: async () => {
        $q.refetch();
        Onyx.toaster.show({ type: 'info', icon: IconDiscover, title: 'Refreshing...' });
      },
    },
    { priority: 4 },
  );

  $: if ($q.isFetching) {
    loadMoreTitle = 'Loading more...';
  } else if ($q.hasNextPage) {
    loadMoreTitle = 'Load more';
  } else {
    loadMoreTitle = 'End of list';
  }

  onDestroy(() => keyMan.unsubscribe());
</script>

{#if $q.isLoading}
  <Typography align="center">Loading...</Typography>
{/if}
{#if $q.error}
  <Typography align="center">Error!</Typography>
{/if}
{#if $q.isSuccess}
  {#each $q.data.pages as page}
    {#each page.value as status}
      {#if status.visibility === 'public' && !status.account.bot}
        {#if $settings.showSensitive ? true : status.sensitive === false}
          {#if status.reblog}
            <!-- Reblogger information to pass as prop -->
            {@const origin = { by: status.account.displayName, avatar: status.account.avatarStatic }}
            <StatusItem {queryKey} status={status.reblog} {origin} />
          {:else}
            <StatusItem {queryKey} {status} />
          {/if}
        {/if}
      {/if}
    {/each}
  {/each}
  <Button
    title={loadMoreTitle}
    disabled={!$q.hasNextPage || $q.isFetchingNextPage}
    navi={{
      itemId: 'STATUS_LOAD_MORE',
      onSelect: () => $q.fetchNextPage(),
    }}
  />
{/if}

<style global lang="postcss">
  .status-content > p:not(:first-child) {
    @apply mt-2;
  }
</style>
