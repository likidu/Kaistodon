<script lang="ts">
  import { replace } from 'svelte-spa-router';

  import Button from '@/ui/components/buttons/Button.svelte';
  import SelectRow from '@/ui/components/form/SelectRow.svelte';
  import Icon from '@/ui/components/icon/Icon.svelte';
  import SoftKey from '@/ui/components/softkey/SoftKey.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewFooter from '@/ui/components/view/ViewFooter.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { Color, IconSize } from '@/ui/enums';
  import { IconInfo, IconMenu } from '@/ui/icons';
  import { Onyx } from '@/ui/services';

  import { themes } from '@/lib/configs';
  import type { Settings } from '@/lib/models';
  import { settings, tokens } from '@/lib/stores';

  function signout() {
    Onyx.dialog.show({
      title: 'Sure to sign out?',
      actions: {
        center: { label: 'Cancel', fn: () => console.log('Cancel sign out.') },
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
    <SelectRow
      label="Theme"
      value={$settings.themeId}
      options={[
        { id: 'mastodon-light', label: 'Light' },
        { id: 'mastodon-dark', label: 'Dark' },
      ]}
      onChange={(val) => handleChange('themeId', val)}
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
  <ViewFooter>
    <SoftKey>
      <div><Icon size={IconSize.Small}><IconMenu /></Icon></div>
      <div>
        <Icon size={IconSize.Small}><IconInfo /></Icon>
      </div>
    </SoftKey>
  </ViewFooter>
</View>
