<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';
  import { replace } from 'svelte-spa-router';

  import Button from '@/ui/components/buttons/Button.svelte';
  import Divider from '@/ui/components/divider/Divider.svelte';
  import SelectRow from '@/ui/components/form/SelectRow.svelte';
  import ToggleRow from '@/ui/components/form/ToggleRow.svelte';
  import ListItem from '@/ui/components/list/ListItem.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { Alignment, Color } from '@/ui/enums';
  import { Onyx } from '@/ui/services';

  import { themes } from '@/lib/configs';
  import type { Settings } from '@/lib/models';
  import { masto } from '@/lib/services';
  import { settings, tokens } from '@/lib/stores';

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

  function handleChange(key: keyof Settings, val: any) {
    settings.updateOne(key, val);

    if (key === 'themeId') {
      const theme = themes.find((a) => a.id === $settings.themeId) ?? themes[2];
      settings.update({
        accentColorH: theme.values.accentColorH,
        accentColorS: theme.values.accentColorS,
        accentColorL: theme.values.accentColorL,
        cardColorH: theme.values.cardColorH,
        cardColorS: theme.values.cardColorS,
        cardColorL: theme.values.cardColorL,
        textColorH: theme.values.textColorH,
        textColorS: theme.values.textColorS,
        textColorL: theme.values.textColorL,
        focusColorA: theme.values.focusColorA,
        dividerColorA: theme.values.dividerColorA,
      });
    }
  }
</script>

<View>
  <ViewHeader title="Settings" />
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
    {/if}
    <Button
      title="Switch Instance"
      color={Color.Primary}
      navi={{
        itemId: 'SWITCH_INSTANCE',
        onSelect: () => replace('/login/switch'),
      }}
    />
    <Divider />
    <SelectRow
      label="Theme"
      value={$settings.themeId}
      options={[
        { id: 'mastodon-light', label: 'Light' },
        { id: 'mastodon-dark', label: 'Dark' },
      ]}
      onChange={(val) => handleChange('themeId', val)}
    />
    <ToggleRow
      label="Shortcut Key"
      value={$settings.enableShortcutKeys}
      onChange={(val) => handleChange('enableShortcutKeys', val)}
    />
    <Divider />
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
