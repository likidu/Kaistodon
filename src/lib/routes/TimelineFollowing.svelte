<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';

  const queryKey = 'timeline-following';

  let statuses;
  $: if (!statuses && $masto) statuses = $masto.v1.timelines.listHome({ limit: 3 });

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: [queryKey],
    queryFn: async ({ pageParam }) => {
      // if (pageParam === undefined) await statuses;
      return await statuses.next();
    },
    getNextPageParam: (lastStatus) => {
      const { done } = lastStatus;
      return done ? undefined : true;
    },
    refetchOnWindowFocus: false,
  });
</script>

<StatusList {queryKey} {query} />
