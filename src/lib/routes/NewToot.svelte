<script lang="ts">
  import { OnyxKeys } from 'onyx-keys';

  import TextArea from '@/ui/components/form/TextArea.svelte';
  import ListItem from '@/ui/components/list/ListItem.svelte';
  import SoftKey from '@/ui/components/softkey/SoftKey.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewFooter from '@/ui/components/view/ViewFooter.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { Alignment } from '@/ui/enums';
  import { Onyx } from '@/ui/services';

  import { useUserProfile } from '@/lib/services';
  import LabeledRow from '@/ui/components/LabeledRow.svelte';

  const profile = useUserProfile();
  const limit = 10;

  const keyMan = OnyxKeys.subscribe(
    {
      onSoftLeft: async () => {
        Onyx.contextMenu.open({
          title: 'Toot Options',
          items: [
            {
              label: 'Image',
              onSelect: () => {
                Onyx.contextMenu.close();
              },
            },
            {
              label: 'Poll',
              onSelect: () => {},
            },
          ],
        });
      },
      onSoftRight: async () => {
        if (toot !== '') console.log(toot);
      },
    },
    { priority: 3 },
  );

  let toot = '';
  $: count = () => {
    const dom = new DOMParser().parseFromString(toot, 'text/html');
    const text = dom.body.textContent || '';
    // toot.trim().replace(/\s+/g, ' ').split(' ').length;
    return text.trim().length;
  };

  function textCount() {
    return toot.trim().replace(/\s+/g, ' ').split(' ').length;
  }
</script>

<View>
  <ViewHeader title="New Toot" />
  <ViewContent>
    {#if $profile.status === 'loading'}
      <Typography align="center">Loading Profile...</Typography>
    {:else if $profile.status === 'error'}
      <Typography align="center">Error!</Typography>
    {:else}
      {@const profile = $profile.data}
      <ListItem
        imageUrl={profile.avatarStatic}
        align={Alignment.Top}
        titleText={profile.displayName === '' ? profile.username : profile.displayName}
        subtitleText={profile.url}
        navi={{ itemId: 'USER-PROFILE', onSelect: () => {} }}
        nofocus={true}
      />
    {/if}
    <LabeledRow label={`Remaining: ${(limit - count()).toString()}`}>
      <TextArea bind:value={toot} placeholder="Your new toot..." stopAddingText={count() >= limit} />
    </LabeledRow>
  </ViewContent>
  <ViewFooter>
    <SoftKey>
      <div>Options</div>
      <div>Enter</div>
      <div>Publish</div>
    </SoftKey>
  </ViewFooter>
</View>
