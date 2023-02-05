<script lang="ts">
  import { createInfiniteQuery, createQuery, useQueryClient } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';

  import Icon from '@/ui/components/icon/Icon.svelte';
  import ListHeader from '@/ui/components/list/ListHeader.svelte';
  import SoftKey from '@/ui/components/softkey/SoftKey.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewFooter from '@/ui/components/view/ViewFooter.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { IconSize } from '@/ui/enums';
  import { IconBlock, IconFlag, IconMenu, IconUser, IconUserMinus, IconUserPlus, IconVolumeX } from '@/ui/icons';
  import { Onyx } from '@/ui/services';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';
  import ProfileCard from '../components/ProfileCard.svelte';

  export let params: { id: string };

  let title = 'Account';

  const queryClient = useQueryClient();

  const keyMan = OnyxKeys.subscribe(
    {
      onSoftRight: async () => {
        if ($relationships.isSuccess) {
          const { following, muting, blocking } = $relationships.data[0];
          Onyx.contextMenu.open({
            title: 'Account Options',
            items: [
              {
                label: following ? 'Unfollow' : 'Follow',
                icon: following ? IconUserMinus : IconUserPlus,
                onSelect: async () => {
                  follow(following);
                  queryClient.invalidateQueries({ queryKey: ['user-relationship', params.id] });
                  Onyx.contextMenu.close();
                },
              },
              {
                label: muting ? 'Unmute' : 'Mute',
                icon: IconVolumeX,
                onSelect: () => {},
              },
              {
                label: blocking ? 'Unblock' : 'Block',
                icon: IconBlock,
                onSelect: () => {},
              },
              {
                label: 'Report',
                icon: IconFlag,
                onSelect: () => {},
              },
            ],
          });
        }
      },
    },
    { priority: 3 },
  );

  const profile = createQuery<mastodon.v1.Account>({
    queryKey: ['user-profile', params.id],
    queryFn: async () => await $masto.v1.accounts.fetch(params.id),
  });

  const relationships = createQuery<mastodon.v1.Relationship[]>({
    queryKey: ['user-relationship', params.id],
    queryFn: async () => await $masto.v1.accounts.fetchRelationships([params.id]),
  });

  $: if ($profile.data?.id) title = $profile.data.displayName;

  let statuses;
  $: if (!statuses && $masto) statuses = $masto.v1.accounts.listStatuses(params.id, { limit: 5 });

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: ['user-timeline', params.id],
    queryFn: async ({ pageParam }) => {
      return await statuses.next();
    },
    getNextPageParam: (lastStatus) => {
      if (lastStatus) {
        const { done } = lastStatus;
        return done ? undefined : true;
      }
    },
  });

  onDestroy(() => keyMan.unsubscribe());

  async function follow(following: boolean) {
    if (!following) {
      try {
        await $masto.v1.accounts.follow(params.id);
      } catch (error) {}
    } else {
      try {
        await $masto.v1.accounts.unfollow(params.id);
      } catch (error) {}
    }
  }
</script>

<View>
  <ViewHeader {title} />
  <ViewContent>
    {#if $profile.isLoading && $relationships.isLoading}
      <Typography align="center">Loading Profile...</Typography>
    {/if}
    {#if $profile.error || $relationships.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $profile.isSuccess && $relationships.isSuccess}
      {@const profile = $profile.data}
      {@const relationships = $relationships.data}
      <ProfileCard {profile} relationship={relationships[0]} />
      <ListHeader title="Statuses" />
      <StatusList {query} />
    {/if}
  </ViewContent>
  <ViewFooter>
    <SoftKey>
      <div><Icon size={IconSize.Small}><IconMenu /></Icon></div>
      <div><Icon size={IconSize.Small}><IconUser /></Icon></div>
    </SoftKey>
  </ViewFooter>
</View>
