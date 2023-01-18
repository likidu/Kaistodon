<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';

  // const getStatuses = async ({ pageParam = false }): Promise<mastodon.v1.Status[]> => {
  //   if (pageParam) {
  //     const { value } = await statuses.next();
  //     return value;
  //   } else {
  //     return await statuses;
  //   }
  // };

  /**
   * Common function to get statuses
   * @param pageParam: call next page
   * @returns Status[]
   */
  const getStatuses = async (pageParam: string): Promise<mastodon.v1.Status[]> =>
    await $masto.v1.timelines.listPublic({
      local: true,
      limit: 5,
      ...(pageParam && { maxId: pageParam }),
    });

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: ['timeline-public'],
    queryFn: ({ pageParam }) => getStatuses(pageParam),
    getNextPageParam: (lastStatuses) => lastStatuses[lastStatuses.length - 1].id,
    refetchOnWindowFocus: false,
    // staleTime: 3 * 60 * 1000,
    staleTime: Infinity,
    cacheTime: Infinity,
  });
</script>

{#if $masto}
  <StatusList {query} />
{/if}
