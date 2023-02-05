<script lang="ts">
  import { push } from 'svelte-spa-router';

  import { settings } from '@/lib/stores';
  import ListSimpleItem from '@/ui/components/list/ListSimpleItem.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { IconSize } from '@/ui/enums';
  import { IconHourglass, IconPen, IconSettings, IconTrend, IconUser } from '@/ui/icons';
  import { Onyx } from '@/ui/services';
  import { getShortcutFromIndex } from '@/ui/utils/getShortcutFromIndex';

  type MenuItem = {
    id: string;
    text: string;
    route: string;
    icon: any | null;
  };
  const menuItems: MenuItem[] = [
    { id: 'NEW', text: 'New Toot', route: '/new', icon: IconPen },
    { id: 'TIMELINE', text: 'Timeline', route: '/timeline', icon: IconHourglass },
    { id: 'EXPLORE', text: 'Explore', route: '/explore', icon: IconTrend },
    { id: 'PROFILE', text: 'Profile', route: '/profile', icon: IconUser },
    { id: 'SETTINGS', text: 'Settings', route: '/settings', icon: IconSettings },
  ];
</script>

<View>
  <ViewHeader title={$settings.instance} />
  <ViewContent>
    {#each menuItems as item, i}
      <ListSimpleItem
        icon={item.icon}
        imageSize={IconSize.Small}
        primaryText={item.text}
        navi={{
          itemId: `MENU_${item.id}`,
          shortcutKey: getShortcutFromIndex(i),
          onSelect: () => {
            Onyx.appMenu.close();
            if (location.hash.startsWith(`#${item.route}`)) {
              return;
            }
            push(item.route);
          },
        }}
      />
    {/each}
  </ViewContent>
</View>

<style>
  :global([data-onyx-group-id='app-menu']) {
    border-radius: var(--radius) var(--radius) 0 0;
    background-color: var(--card-color);
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
