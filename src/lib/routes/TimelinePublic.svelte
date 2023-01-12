<script lang="ts">
  import { useInfiniteQuery } from '@sveltestack/svelte-query';
  import type { mastodon } from 'masto';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';

  let statuses;
  $: if ($masto) {
    statuses = $masto.v1.timelines.listPublic({
      local: true,
      limit: 5,
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
      const { value } = await statuses.next();
      return value;
    } else {
      return await statuses;
    }
  };

  // {querykey, pageParam} are what pass to the queryFn
  const queryResult = useInfiniteQuery<mastodon.v1.Status[], Error>(
    ['timeline-public'],
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
