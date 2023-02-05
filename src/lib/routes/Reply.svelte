<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';
  import { pop } from 'svelte-spa-router';

  import Divider from '@/ui/components/divider/Divider.svelte';
  import TextAreaBox from '@/ui/components/form/TextAreaBox.svelte';
  import LabeledRow from '@/ui/components/LabeledRow.svelte';
  import SoftKey from '@/ui/components/softkey/SoftKey.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewFooter from '@/ui/components/view/ViewFooter.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { Onyx } from '@/ui/services';

  import StatusItem from '@/lib/components/StatusItem.svelte';
  import type { PhotoAttachment } from '@/lib/models';
  import { masto } from '@/lib/services';

  export let params: { id: string };

  let toot = '';
  let photo: PhotoAttachment;
  // Characters limit
  const limit = 500;

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
              label: 'Discard',
              onSelect: () => {
                Onyx.contextMenu.close();
                pop();
              },
            },
          ],
        });
      },
      onSoftRight: async () => {
        if (toot !== '') {
          try {
            const status = await $masto.v1.statuses.create({
              inReplyToId: params.id,
              status: toot,
              visibility: 'public',
            });
            if (status.id) {
              Onyx.contextMenu.close();
              Onyx.toaster.show({ type: 'success', title: 'Reply published.' });
              pop();
            }
          } catch (error) {
            Onyx.toaster.show({ type: 'error', title: `Reply publish error: ${error}` });
          }
        }
      },
    },
    { priority: 3 },
  );

  $: status = createQuery<mastodon.v1.Status>({
    queryKey: ['status', params.id],
    queryFn: async () => !!$masto && (await $masto.v1.statuses.fetch(params.id)),
  });

  onDestroy(() => keyMan.unsubscribe());
</script>

<View>
  <ViewHeader title="Reply" />
  <ViewContent>
    {#if $status.isLoading}
      <Typography align="center">Loading Status...</Typography>
    {/if}
    {#if $status.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $status.isSuccess}
      {@const status = $status.data}
      <LabeledRow label={`Remaining: ${(limit - toot.trim().length).toString()}`}>
        <TextAreaBox
          value={`@${status.account.username} `}
          maxlength={limit}
          onChange={(val) => (toot = val.toString())}
        />
      </LabeledRow>
      <Divider title="In reply to" />
      {#if status.reblog}
        <!-- Reblogger information to pass as prop -->
        {@const origin = { by: status.account.displayName, avatar: status.account.avatarStatic }}
        <StatusItem status={status.reblog} {origin} showImages={false} />
      {:else}
        <StatusItem {status} showImages={false} />
      {/if}
    {/if}
  </ViewContent>
  <ViewFooter>
    <SoftKey>
      <div>Options</div>
      <div>Post</div>
    </SoftKey>
  </ViewFooter>
</View>
