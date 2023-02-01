<script lang="ts">
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';
  import { querystring } from 'svelte-spa-router';

  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';

  import { masto } from '@/lib/services';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import ProfileItem from '../components/ProfileItem.svelte';
  import StatusItem from '../components/StatusItem.svelte';
  import TagItem from '../components/TagItem.svelte';

  const params = new URLSearchParams($querystring);
  const keyword = params.get('keyword');
  const type = params.get('type') as mastodon.v2.SearchType;

  let title = '';
  switch (type) {
    case 'accounts':
      title = `@${keyword}`;
      break;
    case 'hashtags':
      title = `#${keyword}`;
      break;
    default:
      title = keyword;
      break;
  }

  const keyMan = OnyxKeys.subscribe(
    {
      onSoftLeft: async () => {},
    },
    { priority: 3 },
  );

  $: search = !!$masto && $masto.v2.search({ q: keyword, type, limit: 8 });

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: ['search-result'],
    queryFn: async ({ pageParam }) => {
      if (pageParam === undefined) await search;
      return await search.next();
    },
    getNextPageParam: (lastPage) => {
      const { done } = lastPage;
      return !done;
    },
  });

  onDestroy(() => keyMan.unsubscribe());
</script>

<View>
  <ViewHeader title={`Search: ${title}`} />
  <ViewContent>
    {#if $query.isLoading}
      <Typography align="center">Loading...</Typography>
    {/if}
    {#if $query.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $query.isSuccess}
      {#each $query.data.pages as page}
        {#if type === 'accounts' && page.value.accounts && page.value.accounts.length > 0}
          {#each page.value.accounts as profile}
            <ProfileItem {profile} />
          {/each}
        {/if}
        {#if type === 'hashtags' && page.value.hashtags && page.value.hashtags.length > 0}
          {#each page.value.hashtags as tag, i}
            <TagItem {tag} index={i} />
          {/each}
        {/if}
        {#if type === 'statuses' && page.value.statuses && page.value.statuses.length > 0}
          {#each page.value.statuses as status}
            <StatusItem {status} />
          {/each}
        {/if}
      {/each}
      {console.log($query.data.pages)}
    {/if}
  </ViewContent>
</View>
