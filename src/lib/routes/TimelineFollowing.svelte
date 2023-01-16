<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';

  let statuses;
  $: if ($masto && !statuses) {
    statuses = $masto.v1.timelines.listHome({
      limit: 5,
    });
  }

  /**
   * Common function to get statuses
   * @param pageParam: call next page
   * @returns Status[]
   */
  const getStatuses = async ({ pageParam = false }): Promise<mastodon.v1.Status[]> => {
    if (pageParam) {
      const { value } = await statuses.next();
      return value;
    } else {
      return await statuses;
    }
  };

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: ['timeline-following'],
    queryFn: getStatuses,
    getNextPageParam: () => {
      // After first call, always return true to call next() function
      return true;
    },
  });
</script>

{#if $masto}
  <StatusList {query} />
{/if}
