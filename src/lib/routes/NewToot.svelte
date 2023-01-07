<script lang="ts">
  import { OnyxKeys } from 'onyx-keys';

  import TextArea from '@/ui/components/form/TextArea.svelte';
  import LabeledRow from '@/ui/components/LabeledRow.svelte';
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

  const profile = useUserProfile();

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
      {console.log(profile)}
      <ListItem
        imageUrl={profile.avatarStatic}
        align={Alignment.Top}
        titleText={profile.displayName === '' ? profile.username : profile.displayName}
        subtitleText={profile.url}
        navi={{ itemId: 'USER-PROFILE', onSelect: () => {} }}
        nofocus={true}
      />
    {/if}
    <LabeledRow label="I am tooting:">
      <TextArea
        value={toot}
        placeholder="Your new toot..."
        onChange={(val) => {
          toot = val.toString();
        }}
      />
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
