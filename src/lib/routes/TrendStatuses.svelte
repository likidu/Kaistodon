<script lang="ts">
  import { useInfiniteQuery } from '@sveltestack/svelte-query';
  import type { mastodon } from 'masto';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';

  let statuses;
  $: if ($masto) {
    statuses = $masto.v1.trends.listStatuses({
      limit: 3,
    });
  }

  /**
   * Common function to get statuses
   * @param pageParam: call next page
   * @returns Status[]
   */
  const getStatuses = async (pageParam: boolean): Promise<mastodon.v1.Status[]> => {
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
  const queryResult = useInfiniteQuery<mastodon.v1.Status[], Error>(
    ['trend-status'],
    ({ pageParam }) => getStatuses(pageParam),
    {
      // After first call, always return true to call next() function
      getNextPageParam: () => {
        return true;
      },
      staleTime: 5 * 60 * 1000,
    },
  );
</script>

{#if $masto}
  <StatusList {queryResult} />
{/if}
