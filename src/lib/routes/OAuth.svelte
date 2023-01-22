<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';

  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';

  import { REDIRECT_URL } from '@/lib/configs';
  import type { TokenRequest, TokenResponse } from '@/lib/models';
  import { getCurrentInstance, tokens } from '@/lib/stores';

  export let params: { code: string };

  const { code } = params;
  const { id, url, client_id, client_secret } = getCurrentInstance();

  onMount(async () => {
    if (!code) return;

    const request: TokenRequest = {
      client_id,
      client_secret,
      scope: 'read write follow push',
      redirect_uri: REDIRECT_URL,
      code,
      grant_type: 'authorization_code',
    };

    try {
      const { data } = await axios.post<TokenResponse>(`https://${url}/oauth/token`, request);
      const { access_token: token } = data;
      // Update instance's token in Local Storage
      console.log('[OAuth]: Access token: ', token);
      tokens.update({ instance: id, token });

      replace('/timeline');

      return;
    } catch (error) {
      replace('/login');
    }
  });
</script>

<View>
  <ViewContent>
    <Typography align="center">Signing in {id}...</Typography>
    <p>{code}</p>
  </ViewContent>
</View>
