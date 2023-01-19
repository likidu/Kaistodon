<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';

  const queryKey = 'timeline-trend';

  let statuses;
  $: if ($masto && !statuses) {
    console.log('[TrendStatuses]: Got masto store.');
    statuses = $masto.v1.trends.listStatuses({
      limit: 3,
    });
  }

  /**
   * Common function to get statuses
   * @param pageParam: call next page
   * @returns Status[]
   */
  const getStatuses = async ({ pageParam = false }): Promise<mastodon.v1.Status[]> => {
    console.log('triggered, next is', pageParam);
    if (pageParam) {
      // TODO: Set corret statuses type as it was lazy loaded
      const { value } = await statuses.next();
      return value;
    } else {
      return await statuses;
    }
  };

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: [queryKey],
    queryFn: getStatuses,
    getNextPageParam: () => {
      // After first call, always return true to call next() function
      return true;
    },
  });
</script>

{#if statuses}
  <StatusList {queryKey} {query} />
{/if}
