<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { replace } from 'svelte-spa-router';

  import Button from '@/ui/components/buttons/Button.svelte';
  import ListItem from '@/ui/components/list/ListItem.svelte';
  import ListSimpleItem from '@/ui/components/list/ListSimpleItem.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { Alignment, Color, IconSize } from '@/ui/enums';
  import { IconBookmark, IconComment, IconStar } from '@/ui/icons';
  import { Onyx } from '@/ui/services';

  import { masto } from '@/lib/services';
  import { tokens } from '@/lib/stores';

  $: profile = createQuery<mastodon.v1.Account>({
    queryKey: ['my-profile'],
    queryFn: async () => !!$masto && (await $masto.v1.accounts.verifyCredentials()),
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  function signout() {
    Onyx.dialog.show({
      title: 'Sure to sign out?',
      actions: {
        left: { label: 'Cancel', fn: () => console.log('Cancel sign out.') },
        right: {
          label: 'Sign out',
          fn: () => {
            // Clean storage
            tokens.reset();

            replace('/login');
          },
        },
      },
    });
  }
</script>

<View>
  <ViewHeader title="My Profile" />
  <ViewContent>
    {#if $profile.isLoading}
      <Typography align="center">Loading Profile...</Typography>
    {/if}
    {#if $profile.error}
      <Typography align="center">Error!</Typography>
    {/if}
    {#if $profile.isSuccess}
      {@const profile = $profile.data}
      <ListItem
        imageUrl={profile.avatarStatic}
        align={Alignment.Top}
        titleText={profile.displayName === '' ? profile.username : profile.displayName}
        subtitleText={profile.url}
        navi={{ itemId: 'MY_PROFILE', onSelect: () => {} }}
        nofocus={true}
      />
      <ListSimpleItem
        primaryText="Statuses"
        icon={IconComment}
        imageSize={IconSize.Small}
        navi={{ itemId: 'POST', onSelect: () => {} }}
      />
      <ListSimpleItem
        primaryText="Favorites"
        icon={IconStar}
        imageSize={IconSize.Small}
        navi={{ itemId: 'FAV', onSelect: () => {} }}
      />
      <ListSimpleItem
        primaryText="Bookmarks"
        icon={IconBookmark}
        imageSize={IconSize.Small}
        navi={{ itemId: 'BOOKMARK', onSelect: () => {} }}
      />
    {/if}

    <Button
      title="Switch Instance"
      color={Color.Primary}
      navi={{
        itemId: 'SWITCH_INSTANCE',
        onSelect: () => replace('/login/switch'),
      }}
    />
    <Button
      title="Sign out"
      color={Color.Primary}
      navi={{
        itemId: 'SIGN_OUT',
        onSelect: () => signout(),
      }}
    />
  </ViewContent>
</View>
