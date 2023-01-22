<script lang="ts">
  import Router, { location, replace } from 'svelte-spa-router';
  import { fade } from 'svelte/transition';

  import Tab from '@/ui/components/tab/Tab.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';

  import { TimelineFollowing, TimelinePublic, TimelineTrend } from '@/lib/routes';

  const prefix = '/timeline';
  const routes = {
    '/following': TimelineFollowing,
    '/trend': TimelineTrend,
    '/public': TimelinePublic,
  };

  const tabItems = [
    {
      label: 'Following',
      url: `${prefix}/following`,
    },
    {
      label: 'Trend',
      url: `${prefix}/trend`,
    },
    {
      label: 'Local',
      url: `${prefix}/public`,
    },
  ];

  $: if ($location === prefix) replace(`${prefix}/following`);
</script>

<View>
  <ViewHeader>
    <Tab items={tabItems} />
  </ViewHeader>
  <ViewContent>
    <div in:fade={{ duration: 500 }}>
      <Router {routes} {prefix} restoreScrollState={true} />
    </div>
  </ViewContent>
</View>
