<script lang="ts">
  import Router, { location, replace } from 'svelte-spa-router';
  import { fade } from 'svelte/transition';

  import Icon from '@/ui/components/icon/Icon.svelte';
  import SoftKey from '@/ui/components/softkey/SoftKey.svelte';
  import Tab from '@/ui/components/tab/Tab.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewFooter from '@/ui/components/view/ViewFooter.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { IconSize } from '@/ui/enums';
  import { IconDotsVertical, IconMenu } from '@/ui/icons';

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
  <ViewFooter>
    <SoftKey>
      <div><Icon size={IconSize.Small}><IconMenu /></Icon></div>
      <div><Icon size={IconSize.Small}><IconDotsVertical /></Icon></div>
    </SoftKey>
  </ViewFooter>
</View>
