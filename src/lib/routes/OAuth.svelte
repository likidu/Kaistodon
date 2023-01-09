<script lang="ts">
  import { onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';

  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';

  import { CLIENT_ID, CLIENT_SECRET, Instance, REDIRECT_URL_LOCAL } from '@/lib/configs';
  import type { TokenRequest } from '@/lib/models';
  import { tokens } from '@/lib/stores';

  export let code: string;

  let instance: string = Instance.CMX;

  onMount(async () => {
    if (!code) return;

    const request: TokenRequest = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: 'read write follow push',
      redirect_uri: REDIRECT_URL_LOCAL,
      code,
      grant_type: 'authorization_code',
    };
    const response = await fetch(`https://${instance}/oath/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(request),
    });
    const { token } = await response.json();
    console.log('Token: ', token);
    tokens.update({ instance, token });

    replace('/trend');
  });
</script>

<View>
  <ViewContent>
    <Typography align="center">Sign in to cmx.im...</Typography>
  </ViewContent>
</View>
