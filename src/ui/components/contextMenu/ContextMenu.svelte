<script lang="ts">
  import { OnyxKeys } from 'onyx-keys';
  import { onDestroy } from 'svelte';
  import { RenderState } from '../../enums';
  import { Onyx } from '../../services';
  import { contextMenu } from '../../stores';
  import { getShortcutFromIndex } from '../../utils';
  import Divider from '../divider/Divider.svelte';
  import Grid from '../grid/Grid.svelte';
  import NavGroup from '../nav/NavGroup.svelte';
  import Typography from '../Typography.svelte';
  import ContextMenuItem from './ContextMenuItem.svelte';
  import ContextMenuShortcut from './ContextMenuShortcut.svelte';

  let working: string | null = null;

  const keyMan = OnyxKeys.subscribe(
    {
      onSoftLeft: async () => {},
      onSoftLeftLong: async () => {},
      onSoftRight: async () => {
        Onyx.contextMenu.close();
      },
    },
    { priority: 4 },
  );

  onDestroy(() => keyMan.unsubscribe());
</script>

<div class="root">
  <div class="scrim" class:open={$contextMenu.state === RenderState.Open} />
  <div class="card" class:open={$contextMenu.state === RenderState.Open}>
    <div class="title">{$contextMenu.data.title}</div>
    {#if $contextMenu.data.body}
      <Typography>{$contextMenu.data.body}</Typography>
    {/if}
    <NavGroup groupId="contextMenu" style="flex:1; min-height:0; overflow: auto;">
      {#if $contextMenu.data.shortcuts}
        <Grid>
          {#each $contextMenu.data.shortcuts as shortcut, i}
            <ContextMenuShortcut
              icon={shortcut.icon}
              text={shortcut.label}
              navi={{
                itemId: `menuShortcut${i + 1}`,
                shortcutKey: getShortcutFromIndex(i),
                onSelect: async () => await shortcut.onSelect(),
              }}
            />
          {/each}
        </Grid>
        <Divider />
      {/if}
      {#each $contextMenu.data.items as item, i}
        {@const offset = !!$contextMenu.data.shortcuts && $contextMenu.data.shortcuts.length}
        <ContextMenuItem
          icon={item.icon}
          imageUrl={item.imageUrl}
          text={item.label}
          workingText={item.workingLabel}
          working={working === `menuItem${i + 1}`}
          navi={{
            itemId: `menuItem${i + 1}`,
            shortcutKey: getShortcutFromIndex(offset + i),
            onSelect: async () => {
              if (working) return;
              working = `menuItem${i + 1}`;
              await item.onSelect();
              working = null;
            },
          }}
        />
      {/each}
    </NavGroup>
    <div class="footer">
      <div />
      <div>Select</div>
      <div>Close</div>
    </div>
  </div>
</div>

<style>
  .root {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
  }
  .scrim {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity var(--animation-speed);
    opacity: 0;
  }
  .scrim.open {
    opacity: 1;
  }

  .card {
    border: 1px solid var(--card-border-color);
    box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.2);
    background-color: var(--card-color);
    color: var(--text-color);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    border-radius: var(--radius) var(--radius) 0 0;
    overflow: hidden;
    transition: transform var(--animation-speed);
    transition-timing-function: ease-in;
    transform: translateY(300px);
  }
  .card.open {
    transform: translateY(0);
    transition-timing-function: ease-out;
  }

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 5px;
    font-weight: var(--bold-font-weight);
    text-align: center;
  }

  .footer {
    display: flex;
    padding: 5px;
    text-align: center;
    font-weight: var(--bold-font-weight);
  }
  .footer > div {
    flex: 1;
  }
  .footer > div:first-child {
    text-align: left;
  }
  .footer > div:last-child {
    text-align: right;
  }
</style>
