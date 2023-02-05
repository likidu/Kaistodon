<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';

  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';

  const queryKey = 'my-profile-favorites';

  let statuses;
  $: if (!statuses && $masto) statuses = $masto.v1.favourites.list({ limit: 5 });

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
    // staleTime: 0,
    // cacheTime: 0,
  });
</script>

<View>
  <ViewHeader title="My Favorites" showBack={true} />
  <ViewContent>
    <StatusList {queryKey} {query} />
  </ViewContent>
</View>
