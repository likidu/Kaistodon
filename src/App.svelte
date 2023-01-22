<script lang="ts">
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { OnyxKeys } from 'onyx-keys';
  import { register } from 'register-service-worker';
  import Router, { location, pop, replace } from 'svelte-spa-router';

  import OnyxApp from '@/ui/components/app/OnyxApp.svelte';
  import { Onyx } from '@/ui/services';

  import AppMenu from '@/lib/components/AppMenu.svelte';
  import {
    Account,
    Explore,
    Home,
    Login,
    NewToot,
    NotFound,
    OAuth,
    Search,
    Settings,
    Timeline,
    Toot,
  } from '@/lib/routes';
  import { getCurrentToken, settings } from '@/lib/stores';
  import { onMount } from 'svelte';

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

  // The name has to be consistent with one set in the sw.js
  const channel = new BroadcastChannel('sw-messages');

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: Infinity,
        // cacheTime: Infinity,
      },
    },
  });

  const routes = {
    '/': Home,
    '/timeline': Timeline,
    '/timeline/following': Timeline,
    '/timeline/trend': Timeline,
    '/timeline/public': Timeline,
    '/toot/:id': Toot,
    '/explore': Explore,
    '/search/:keyword': Search,
    '/new': NewToot,
    '/login/:switch?': Login,
    '/oauth/:code': OAuth,
    '/account/:id': Account,
    '/settings': Settings,
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

  $: Onyx.settings.update($settings);

  let hello: string;

  $: onMount(() => {
    // Make Backspace work properly
    // TODO: Fix this in a better way
    document.addEventListener(
      'keydown',
      (ev) => {
        if (
          ev.key === 'Backspace' &&
          $location !== '/' &&
          (ev.target as any).contentEditable !== 'true' &&
          (ev.target as HTMLElement).tagName !== 'INPUT'
        ) {
          ev.preventDefault();
        }
      },
      false,
    );

    channel.onmessage = (ev) => {
      console.log('[App]: Channel message: ', ev.data);
    };

    // Find the token for the selected instance
    const { token } = getCurrentToken();
    if (token === '') {
      console.log('[App]: Not signed in...');
      replace('/login');
      // Wrapped here to skip the OAuth page if there is valid token in Local Storage
      // Get the code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        console.log('[App]: OAuth flow...');
        replace(`/oauth/${code}`);
        return;
      }
      return;
    }

    // Trend is the default route
    if ($location === '/') replace('/timeline');
  });
</script>

<OnyxApp>
  <AppMenu slot="app-menu" />
  <QueryClientProvider client={queryClient}>
    <Router {routes} />
  </QueryClientProvider>
</OnyxApp>
