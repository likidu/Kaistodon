<script lang="ts">
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';
  import Router, { location, push, replace } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import { fade } from 'svelte/transition';

  import Icon from '@/ui/components/icon/Icon.svelte';
  import SoftKey from '@/ui/components/softkey/SoftKey.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewFooter from '@/ui/components/view/ViewFooter.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { IconSize } from '@/ui/enums';
  import { IconDotsVertical, IconMenu } from '@/ui/icons';

  import { TimelineFederated, TimelinePublic } from '@/lib/routes';

  const prefix = '/timeline';
  const routes = {
    '/public': TimelinePublic,
    '/federated': TimelineFederated,
  };

  const keyMan = OnyxKeys.subscribe(
    {
      onArrowLeft: async () => {
        if ($location === `${prefix}/federated`) push(`${prefix}/public`);
      },
      onArrowRight: async () => {
        if ($location === `${prefix}/public`) push(`${prefix}/federated`);
      },
    },
    { priority: 3 },
  );

  $: if ($location === prefix) replace(`${prefix}/public`);

  onDestroy(() => keyMan.unsubscribe());
</script>

<View>
  <ViewHeader>
    <ul class="sub-route">
      <li use:active={`${prefix}/public`}>Public</li>
      <li use:active={`${prefix}/federated`}>Federated</li>
    </ul>
  </ViewHeader>
  <ViewContent>
    <div in:fade={{ duration: 500 }}>
      <Router {routes} {prefix} restoreScrollState={true} />
    </div>
  </ViewContent>
  <ViewFooter>
    <SoftKey
      ><div><Icon size={IconSize.Small}><IconMenu /></Icon></div>
      <div><Icon size={IconSize.Small}><IconDotsVertical /></Icon></div>
    </SoftKey>
  </ViewFooter>
</View>
