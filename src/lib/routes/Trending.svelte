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
  import { IconMenu } from '@/ui/icons';

  import { Statuses, Tags } from '@/lib/routes';

  const prefix = '/trending';
  const routes = {
    '/status': Statuses,
    '/tags': Tags,
  };

  const keyMan = OnyxKeys.subscribe(
    {
      onArrowLeft: async () => {
        if ($location === '/trending/tags') push('/trending/status');
      },
      onArrowRight: async () => {
        if ($location === '/trending/status') push('/trending/tags');
      },
    },
    { priority: 3 },
  );

  $: if ($location === '/trending') replace('/trending/status');

  onDestroy(() => keyMan.unsubscribe());
</script>

<View>
  <ViewHeader>
    <ul class="sub-route">
      <li use:active={'/trending/status'}>Status</li>
      <li use:active={'/trending/tags'}>Tags</li>
    </ul>
  </ViewHeader>
  <ViewContent>
    <div in:fade={{ duration: 500 }}>
      <Router {routes} {prefix} restoreScrollState={true} />
    </div>
  </ViewContent>
  <ViewFooter>
    <SoftKey>
      <div><Icon size={IconSize.Small}><IconMenu /></Icon></div>
      <div><Icon size={IconSize.Small}><IconMenu /></Icon></div>
    </SoftKey>
  </ViewFooter>
</View>
