<script lang="ts">
  import { push } from 'svelte-spa-router';

  import ListItem from '@/ui/components/list/ListItem.svelte';
  import NavGroup from '@/ui/components/nav/NavGroup.svelte';
  import { Onyx } from '@/ui/services';
  import { getShortcutFromIndex } from '@/ui/utils/getShortcutFromIndex';

  import { IconDiscover, IconSettings, IconUser } from '@/ui/icons';

  type MenuItem = {
    id: string;
    text: string;
    route: string;
    icon: any | null;
  };
  const menuItems: MenuItem[] = [
    { id: 'new', text: 'New Toot', route: '/new', icon: IconDiscover },
    { id: 'trending', text: 'Trending', route: '#/', icon: IconDiscover },
    { id: 'timeline', text: 'Timeline', route: '/timeline', icon: IconUser },
    { id: 'following', text: 'Following', route: '/following', icon: IconUser },
    { id: 'setttings', text: 'Settings', route: '/settings', icon: IconSettings },
  ];
</script>

<NavGroup groupId="app-menu">
  <div class="header">Kaistodon</div>
  <div class="scroller" data-nav-scroller>
    {#each menuItems as item, i}
      <ListItem
        icon={item.icon}
        primaryText={item.text}
        navi={{
          itemId: item.id,
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
  </div>
</NavGroup>

<style>
  :global([data-onyx-group-id='app-menu']) {
    border-radius: var(--radius) var(--radius) 0 0;
    background-color: var(--card-color);
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .header {
    padding: 5px;
    font-weight: var(--bold-font-weight);
    color: var(--accent-color);
    text-align: center;
  }
  .scroller {
    overflow-y: auto;
    flex: 1;
  }
</style>
