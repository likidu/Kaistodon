<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';

  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';

  import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL } from '@/lib/configs';
  import type { TokenRequest, TokenResponse } from '@/lib/models';
  import { settings, tokens } from '@/lib/stores';

  export let params: { code: string };

  const { code } = params;
  const { instance } = $settings;

  onMount(async () => {
    if (!code) return;

    const request: TokenRequest = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: 'read write follow push',
      redirect_uri: REDIRECT_URL,
      code,
      grant_type: 'authorization_code',
    };

    try {
      const { data } = await axios.post<TokenResponse>(`https://${instance}/oauth/token`, request);
      const { access_token: token } = data;
      // Update instance's token in Local Storage
      console.log('[OAuth]: Access token: ', token);
      tokens.update({ instance, token });

      replace('/trend');

      return;
    } catch (error) {
      replace('/login');
    }
  });
</script>

<View>
  <ViewContent>
    <Typography align="center">Signing in {instance}...</Typography>
    <p>{code}</p>
  </ViewContent>
</View>
