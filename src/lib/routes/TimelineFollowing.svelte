<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';

  /**
   * Common function to get statuses
   * @param pageParam: call next page
   * @returns Status[]
   */
  const getStatuses = async (pageParam: string): Promise<mastodon.v1.Status[]> =>
    await $masto.v1.timelines.listHome({
      limit: 5,
      ...(pageParam && { maxId: pageParam }),
    });

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: ['timeline-following'],
    queryFn: ({ pageParam }) => getStatuses(pageParam),
    getNextPageParam: (lastStatuses) => lastStatuses[lastStatuses.length - 1].id,
    // staleTime: 5 * 60 * 1000,
  });
</script>

{#if $masto}
  <StatusList {query} />
{/if}
