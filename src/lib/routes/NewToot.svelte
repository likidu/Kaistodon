<script lang="ts">
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';
  import { replace } from 'svelte-spa-router';

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

  import { masto, useUserProfile } from '@/lib/services';

  let toot = '';
  let blob;

  const profile = useUserProfile();
  const limit = 500;

  const keyMan = OnyxKeys.subscribe(
    {
      onSoftLeft: async () => {
        Onyx.contextMenu.open({
          title: 'Toot Options',
          items: [
            {
              label: 'Image',
              onSelect: async () => {
                // TODO: Update KaiOS lib to support this type
                // @ts-ignore: next line
                const picker = new WebActivity('pick', { type: ['image/jpeg', 'image/png', 'image/gif'] });
                try {
                  const photo = await picker.start();
                  console.log('Results passed back from activity handler:');
                  console.log(photo);
                  blob = photo;
                } catch (error) {}
                Onyx.contextMenu.close();
              },
            },
            {
              label: 'Poll',
              onSelect: () => {},
            },
            {
              label: 'Discard',
              onSelect: () => {
                replace('/trend');
              },
            },
          ],
        });
      },
      onSoftRight: async () => {
        if (toot !== '') {
          try {
            const status = await masto.v1.statuses.create({
              status: toot,
              visibility: 'public',
            });
            if (status.id) {
              Onyx.toaster.show({ type: 'success', title: 'New toot published.' });
              replace('/');
            }
          } catch (error) {
            Onyx.toaster.show({ type: 'error', title: `New toot publish error: ${error}` });
          }
        }
      },
    },
    { priority: 3 },
  );

  // Counting the remaining allowed chars
  // TODO: This is slow, looking for optimized solution
  $: count = () => {
    const dom = new DOMParser().parseFromString(toot, 'text/html');
    const text = dom.body.textContent || '';
    return text.trim().length;
  };

  onDestroy(() => keyMan.unsubscribe());
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
    <p>{blob}</p>
  </ViewContent>
  <ViewFooter>
    <SoftKey>
      <div>Options</div>
      <div>Publish</div>
    </SoftKey>
  </ViewFooter>
</View>
