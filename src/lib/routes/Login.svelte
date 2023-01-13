<script lang="ts">
  import svelteLogo from '@/assets/svelte.svg';
  import Button from '@/ui/components/buttons/Button.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';

  import SelectRow from '@/ui/components/form/SelectRow.svelte';
  import { CLIENT_ID, Instance, REDIRECT_URL } from '../configs';

  import { settings } from '../stores';

  let instance: string = Instance.CMX;
</script>

<View>
  <ViewHeader title="Sign in" />
  <ViewContent>
    <div class="flex flex-col items-center justify-center">
      <h1>Kaistodon</h1>
      <img src={svelteLogo} class="w-32 h-32" alt="Svelte Logo" />
    </div>
    <SelectRow
      label="Instance"
      value={instance}
      options={[
        { id: Instance.CMX, label: 'cmx.im' },
        { id: Instance.HACHYDERM, label: 'hachyderm.io' },
      ]}
      onChange={(val) => (instance = val.toString())}
    />
    <Button
      title="Sign in"
      navi={{
        itemId: 'SIGN_IN',
        onSelect: async () => {
          // Update current instance in Local Storage
          settings.update({ instance });
          const url = `https://${instance}/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=read write follow push`;
          if (process.env.NODE_ENV === 'development') {
            window.open(url, '_blank');
          } else {
            // TODO: Update KaiOS lib to support this type
            // @ts-ignore: next line
            const view = new WebActivity('view', {
              type: 'url',
              url,
            });
            view.start();
          }
        },
      }}
    />
  </ViewContent>
</View>
