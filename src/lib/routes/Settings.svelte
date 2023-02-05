<script lang="ts">
  import SelectRow from '@/ui/components/form/SelectRow.svelte';
  import ToggleRow from '@/ui/components/form/ToggleRow.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';

  import { themes } from '@/lib/configs';
  import type { Settings } from '@/lib/models';
  import { settings } from '@/lib/stores';

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
    <ToggleRow
      label="Shortcut Key"
      value={$settings.enableShortcutKeys}
      onChange={(val) => handleChange('enableShortcutKeys', val)}
    />
  </ViewContent>
</View>
