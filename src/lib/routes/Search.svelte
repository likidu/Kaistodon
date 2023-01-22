<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';

  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';

  import { masto } from '@/lib/services';

  export let params: { keyword: string };

  /**
   * Common function to get statuses
   * @param pageParam: call next page
   * @returns Status[]
   */
  const getSearchResult = async (pageParam: string): Promise<mastodon.v2.Search> =>
    await $masto.v2.search({
      q: params.keyword,
      limit: 5,
      // ...(pageParam && { maxId: pageParam }),
    });

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: ['search-result'],
    queryFn: ({ pageParam }) => getSearchResult(pageParam),
    getNextPageParam: (lastStatuses) => {},
  });
</script>

<View>
  <ViewContent>
    {#if $query.isLoading}
      <Typography align="center">Loading...</Typography>
    {/if}
    {#if $query.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $query.isSuccess}
      {console.log($query.data.pages)}
    {/if}
  </ViewContent>
</View>
