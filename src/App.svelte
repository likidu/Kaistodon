<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
  import { OnyxKeys } from 'onyx-keys';
  import { register } from 'register-service-worker';
  import { onMount } from 'svelte';
  import Router, { location, pop, replace } from 'svelte-spa-router';

  import OnyxApp from '@/ui/components/app/OnyxApp.svelte';
  import { Onyx } from '@/ui/services';

  import AppMenu from '@/lib/components/AppMenu.svelte';
  import { Home, Login, NewToot, NotFound, OAuth, Settings, Timeline, Trend } from '@/lib/routes';
  import { settings, tokens } from '@/lib/stores';

  const queryClient = new QueryClient();

  const routes = {
    '/': Home,
    '/trend': Trend,
    '/trend/statuses': Trend,
    '/trend/tags': Trend,
    '/new': NewToot,
    '/login': Login,
    '/oauth/:code': OAuth,
    '/timeline': Timeline,
    '/timeline/public': Timeline,
    '/timeline/federated': Timeline,
    '/settings': Settings,
    '*': NotFound,
  };

  // TODO: Fix this in a better way
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Backspace' && $location !== '/' && (ev.target as any).contentEditable !== 'true') {
      ev.preventDefault();
    }
  });
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

  $: onMount(() => {
    // Register service worker
    register('/sw.js', {
      registrationOptions: { scope: './' },
      ready(registration) {
        console.log('Service worker is active.');
      },
      registered(registration) {
        console.log('Service worker is registered!');
      },
      error(error) {
        console.error('Error during service worker registration:', error);
      },
    });

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      console.log('OAuth flow...');
      replace(`/oauth/${code}`);
      return;
    }

    const { token } = $tokens.find((t) => t.instance === $settings.instance);
    if (token === '') {
      console.log('Not signed in...');
      replace('/login');
      return;
    }

    // Trend is the default route
    // if ($location === '/') replace('/trend');
  });
</script>

<OnyxApp>
  <AppMenu slot="app-menu" />
  <QueryClientProvider client={queryClient}>
    <Router {routes} />
  </QueryClientProvider>
</OnyxApp>
