<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
  import Router, { location, pop, replace } from 'svelte-spa-router';

  import OnyxApp from '@/ui/components/app/OnyxApp.svelte';
  import { Onyx } from '@/ui/services';
  import { OnyxKeys } from 'onyx-keys';

  import AppMenu from '@/lib/components/AppMenu.svelte';

  import { Comment, Login, NotFound, Settings, Timeline, Trend } from '@/lib/routes';
  import { settings } from '@/lib/stores/settings';

  const queryClient = new QueryClient();

  const routes = {
    '/trend': Trend,
    '/trend/statuses': Trend,
    '/trend/tags': Trend,
    '/login': Login,
    '/timeline': Timeline,
    '/settings': Settings,
    '/comment/:id': Comment,
    '*': NotFound,
  };

  const keyMan = OnyxKeys.subscribe(
    {
      onBackspace: async () => {
        // If on the main screen, let KaiOS minimize the app
        if ($location === '/') {
          console.log('exit app');
          return;
        }

        pop();
      },
    },
    { priority: 1 },
  );

  OnyxKeys.setOptions({
    repeatDelay: 2000,
    repeatRate: 2000,
  });

  $: Onyx.settings.update($settings);

  $: if ($location === '/') replace('/trend');
</script>

<OnyxApp>
  <AppMenu slot="app-menu" />
  <QueryClientProvider client={queryClient}>
    <Router {routes} />
  </QueryClientProvider>
</OnyxApp>
