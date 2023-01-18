<script lang="ts">
  import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';
  import Time from 'svelte-time';

  import Icon from '@/ui/components/icon/Icon.svelte';
  import SoftKey from '@/ui/components/softkey/SoftKey.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewFooter from '@/ui/components/view/ViewFooter.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { IconSize } from '@/ui/enums';
  import { IconBlock, IconFlag, IconMenu, IconUser, IconUserPlus, IconVolumeX } from '@/ui/icons';
  import { Onyx } from '@/ui/services';

  import StatusList from '@/lib/components/StatusList.svelte';
  import { masto } from '@/lib/services';
  import ListHeader from '@/ui/components/list/ListHeader.svelte';
  import NavItem from '@/ui/components/nav/NavItem.svelte';

  export let params: { id: string };

  const keyMan = OnyxKeys.subscribe(
    {
      onSoftRight: async () => {
        Onyx.contextMenu.open({
          title: 'Account Options',
          items: [
            {
              label: 'Follow',
              icon: IconUserPlus,
              onSelect: async () => {},
            },
            {
              label: 'Mute',
              icon: IconVolumeX,
              onSelect: () => {},
            },
            {
              label: 'Block',
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
      },
    },
    { priority: 3 },
  );

  $: profile = createQuery<mastodon.v1.Account>({
    queryKey: ['user-profile', params.id],
    queryFn: async () => !!$masto && (await $masto.v1.accounts.fetch(params.id)),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  /**
   * Common function to get statuses
   * @param pageParam: call next page
   * @returns Status[]
   */
  const getStatuses = async (pageParam: string): Promise<mastodon.v1.Status[]> =>
    await $masto.v1.accounts.listStatuses(params.id, {
      limit: 5,
      ...(pageParam && { maxId: pageParam }),
    });

  // {querykey, pageParam} are what pass to the queryFn
  const query = createInfiniteQuery({
    queryKey: ['user-timeline', params.id],
    queryFn: ({ pageParam }) => getStatuses(pageParam),
    getNextPageParam: (lastStatuses) => lastStatuses[lastStatuses.length - 1].id,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  onDestroy(() => keyMan.unsubscribe());
</script>

<View>
  <ViewHeader title="Account" />
  <ViewContent>
    {#if $profile.isLoading}
      <Typography align="center">Loading Profile...</Typography>
    {/if}
    {#if $profile.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $profile.isSuccess}
      {@const profile = $profile.data}
      <NavItem
        nofocus={true}
        navi={{
          itemId: 'USER-PROFILE',
        }}
      >
        <div class="profile">
          <img src={profile.avatarStatic} alt={profile.acct} class="w-32 h-32 rounded-3xl" />
          <h1>{profile.username}</h1>
          <h2>@{profile.acct}</h2>
          <section class="note">{@html profile.note}</section>
          <p>Joined at <Time timestamp={profile.createdAt} /></p>
        </div>
      </NavItem>
    {/if}
    <ListHeader title="Toots" />
    <StatusList {query} />
  </ViewContent>
  <ViewFooter>
    <SoftKey>
      <div><Icon size={IconSize.Small}><IconMenu /></Icon></div>
      <div><Icon size={IconSize.Small}><IconUser /></Icon></div>
    </SoftKey>
  </ViewFooter>
</View>

<style lang="postcss">
  .profile {
    @apply px-3;
  }
  .profile > h2 {
    color: var(--secondary-text-color);
  }
  .profile > section {
    @apply text-sm;
    color: var(--secondary-text-color);
  }
</style>
