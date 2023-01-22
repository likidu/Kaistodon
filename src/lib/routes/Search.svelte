<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
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
      resolve: true,
      // ...(pageParam && { maxId: pageParam }),
    });

  // {querykey, pageParam} are what pass to the queryFn
  const search = createQuery({
    queryKey: ['search-result'],
    queryFn: ({ pageParam }) => getSearchResult(pageParam),
  });
</script>

<View>
  <ViewContent>
    {#if $search.isLoading}
      <Typography align="center">Loading...</Typography>
    {/if}
    {#if $search.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $search.isSuccess}
      {console.log($search.data)}
    {/if}
  </ViewContent>
</View>
