<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';
  import { replace } from 'svelte-spa-router';

  import TextAreaBox from '@/ui/components/form/TextAreaBox.svelte';
  import LabeledRow from '@/ui/components/LabeledRow.svelte';
  import SoftKey from '@/ui/components/softkey/SoftKey.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewFooter from '@/ui/components/view/ViewFooter.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { Onyx } from '@/ui/services';

  import { masto } from '@/lib/services';
  import Console from '../components/Console.svelte';
  import ProfileItem from '../components/ProfileItem.svelte';
  import type { PhotoAttachment } from '../models';

  let toot = '';
  let photo: PhotoAttachment;
  // Characters limit
  const limit = 500;

  // const pictures = navigator.b2g.getDeviceStorage('pictures');
  // const iterable = pictures.enumerate();
  // printAllFiles(iterable);

  const keyMan = OnyxKeys.subscribe(
    {
      onSoftLeft: async () => {
        Onyx.contextMenu.open({
          title: 'Status Options',
          items: [
            {
              label: 'Add Photo',
              onSelect: async () => {
                // TODO: Update KaiOS lib to support this type
                // @ts-ignore: next line
                const picker = new WebActivity('pick', { type: ['image/jpeg', 'image/png', 'image/gif'] });
                try {
                  photo = await picker.start();
                  console.warn(`photo: ${JSON.stringify(photo)}`);
                  const { filename } = photo;

                  // const attachment = await $masto.v2.mediaAttachments.create({
                  //   file: new Blob([fs.readFileSync('../some_image.png')]),
                  //   description: 'Some image',
                  // });
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
                Onyx.contextMenu.close();
                replace('/timeline');
              },
            },
          ],
        });
      },
      onSoftRight: async () => {
        if (toot !== '') {
          try {
            const status = await $masto.v1.statuses.create({
              status: toot,
              visibility: 'public',
            });
            if (status.id) {
              Onyx.contextMenu.close();
              Onyx.toaster.show({ type: 'success', title: 'New status published.' });
              replace('/timeline');
            }
          } catch (error) {
            Onyx.toaster.show({ type: 'error', title: `New status publish error: ${error}` });
          }
        }
      },
    },
    { priority: 3 },
  );

  $: profile = createQuery<mastodon.v1.Account>({
    queryKey: ['my-profile'],
    queryFn: async () => !!$masto && (await $masto.v1.accounts.verifyCredentials()),
    staleTime: 15 * 60 * 1000,
  });

  // Counting the remaining allowed chars
  // TODO: This is slow, looking for optimized solution
  // $: count = () => {
  // const dom = new DOMParser().parseFromString(toot, 'text/html');
  // const text = dom.body.textContent || '';
  // return text.trim().length;
  // };

  onDestroy(() => keyMan.unsubscribe());

  async function printAllFiles(iterable: any) {
    for await (let file of iterable) {
      console.warn(file);
    }
  }
</script>

<View>
  <ViewHeader title="New Status" />
  <ViewContent>
    {#if $profile.isLoading}
      <Typography align="center">Loading Profile...</Typography>
    {/if}
    {#if $profile.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $profile.isSuccess}
      {@const profile = $profile.data}
      <ProfileItem {profile} nofocus={true} />
    {/if}
    <LabeledRow label={`Remaining: ${(limit - toot.trim().length).toString()}`}>
      <TextAreaBox placeholder="Say to the world..." maxlength={limit} onChange={(val) => (toot = val.toString())} />
    </LabeledRow>
    <Console />
  </ViewContent>
  <ViewFooter>
    <SoftKey>
      <div>Options</div>
      <div>Post</div>
    </SoftKey>
  </ViewFooter>
</View>
