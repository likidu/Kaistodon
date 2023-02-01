<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';

  const queryKey = 'timeline-public';

  $: statuses = !!$masto && $masto.v1.timelines.listPublic({ local: true, limit: 5 });

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: [queryKey],
    queryFn: async ({ pageParam }) => {
      console.log(pageParam);
      // Skip the first call as it will duplicated with next()
      if (pageParam === undefined) await statuses;
      return await statuses.next();
    },
    getNextPageParam: (lastStatus) => {
      const { done } = lastStatus;
      return !done;
    },
    // refetchOnWindowFocus: false,
    // staleTime: Infinity,
    // cacheTime: Infinity,
  });
</script>

<StatusList {queryKey} {query} />
