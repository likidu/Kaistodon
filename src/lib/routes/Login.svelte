<script lang="ts">
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';
  import { replace } from 'svelte-spa-router';

  import logo from '@/assets/mastodon.svg';
  import Button from '@/ui/components/buttons/Button.svelte';
  import Divider from '@/ui/components/divider/Divider.svelte';
  import SelectRow from '@/ui/components/form/SelectRow.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';

  import { INSTANCES, REDIRECT_URL } from '@/lib/configs';
  import { getCurrentInstance, getCurrentToken, settings, tokens } from '@/lib/stores';

  export let params: { switch?: string };

  const title = params.switch ? 'Switch Account' : 'Welcome';

  let instanceId = getCurrentInstance().id;

  const keyMan = OnyxKeys.subscribe(
    {
      // Disable appMenu
      onSoftLeft: async () => {},
    },
    { priority: 4 },
  );

  onDestroy(() => keyMan.unsubscribe());
</script>

<View>
  <ViewHeader {title} />
  <ViewContent>
    <div class="flex flex-col items-center justify-center">
      <img src={logo} class="w-32 h-32" alt="Mastodon Logo" />
      <h1>Kaistodon</h1>
    </div>
    <Divider title="Select instance" />
    <SelectRow
      label="Instance"
      value={instanceId}
      options={INSTANCES.map((ins) => {
        return { id: ins.id, label: ins.url };
      })}
      onChange={(val) => (instanceId = val.toString())}
    />
    <Button
      title="Sign in"
      navi={{
        itemId: 'SIGN_IN',
        onSelect: async () => {
          if (params.switch && getCurrentToken().token && instanceId === getCurrentInstance().id) {
            replace('/settings');
          } else {
            const { id, url, client_id } = INSTANCES.find((ins) => ins.id === instanceId);
            // Update current instance in Local Storage
            settings.update({ instance: id });
            tokens.update({ instance: id, token: '' });
            // Open OAuth Url to get the code
            const oauthUrl = `https://${url}/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${REDIRECT_URL}&scope=read write follow push`;
            if (process.env.NODE_ENV === 'development') {
              window.open(oauthUrl, '_blank');
            } else {
              // TODO: Update KaiOS lib to support this type
              // @ts-ignore: next line
              const view = new WebActivity('view', {
                type: 'url',
                url: oauthUrl,
              });
              view.start();
            }
          }
        },
      }}
    />
  </ViewContent>
</View>
