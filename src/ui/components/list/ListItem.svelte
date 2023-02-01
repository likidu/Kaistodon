<script lang="ts">
  import LineClamp from '@/lib/components/LineClamp.svelte';
  import type { SvelteComponent } from 'svelte';

  import { Alignment, Color, IconSize, Layout } from '../../enums';
  import { IconDotsVertical } from '../../icons';
  import type { ContextMenu, Navigation } from '../../models';
  import { settings } from '../../stores';
  import Icon from '../icon/Icon.svelte';
  import NavItem from '../nav/NavItem.svelte';
  import ListItemWrapper from './ListItemWrapper.svelte';

  export let layout: Layout = Layout.Row;
  export let imageUrl: string = null;
  export let calloutImageUrl: string = null;
  export let imageStyle: 'square' | 'circle' = 'square';
  export let imageSize: IconSize = IconSize.Medium;
  export let icon: typeof SvelteComponent = null;
  export let iconColor: Color = Color.Primary;
  export let align: Alignment = Alignment.Top;
  export let calloutText: string = null;
  export let titleText: string = null;
  export let subtitleText: string = null;
  export let contentText: string = null;
  export let navi: Navigation;
  export let contextMenu: ContextMenu = null;
  export let nofocus = false;

  const flexDirection = layout === Layout.Col ? `flex-direction: row;` : '';
</script>

<NavItem {navi} {contextMenu} {nofocus}>
  <div class="root">
    <div class="container" style={`align-items: ${align}; ${flexDirection}`}>
      {#if calloutText}
        <div class="callout">
          {#if calloutImageUrl}
            <img
              class="image"
              class:circle={true}
              src={calloutImageUrl}
              alt=""
              style={`height: ${IconSize.Small}px; width: ${IconSize.Small}px;`}
            />
          {/if}
          <LineClamp lines={1}><p>{calloutText}</p></LineClamp>
        </div>
      {/if}
      <ListItemWrapper {layout}>
        <svelte:fragment slot="header">
          {#if $settings.shortcutKeyLocation === 'left' && navi.shortcutKey}
            <div class="shortcut">{navi.shortcutKey}</div>
          {/if}
          {#if icon}
            <div class="icon">
              <Icon size={imageSize} color={iconColor}><svelte:component this={icon} /></Icon>
            </div>
          {/if}
          {#if imageUrl}
            <img
              class="image"
              class:circle={imageStyle === 'circle'}
              src={imageUrl}
              alt=""
              style={`height: ${imageSize}px; width: ${imageSize}px;`}
            />
          {/if}
        </svelte:fragment>
        <svelte:fragment slot="title">
          {#if titleText}
            <div class="title">{titleText}</div>
          {/if}
          {#if subtitleText}
            <div class="subtitle">{subtitleText}</div>
          {:else if $$slots['subtitle']}
            <div class="subtitle">
              <slot name="subtitle" />
            </div>
          {/if}
        </svelte:fragment>
        <svelte:fragment slot="settings">
          {#if $settings.shortcutKeyLocation === 'right' && navi.shortcutKey}
            <div class="shortcut">{navi.shortcutKey}</div>
          {/if}
          {#if $settings.contextMenuIndicators && contextMenu}
            <div class="menu-icon">
              <Icon size={IconSize.Small} color={Color.Secondary}><IconDotsVertical /></Icon>
            </div>
          {/if}
        </svelte:fragment>
        <svelte:fragment slot="content">
          {#if contentText}
            <div class="content">{contentText}</div>
          {:else}
            <slot name="content" />
          {/if}
        </svelte:fragment>
      </ListItemWrapper>
    </div>
    <div class="container">
      <!-- <div class="container"> -->
      <slot name="bottom" />
      <!-- </div> -->
    </div>
  </div>
</NavItem>

<style lang="postcss">
  .root {
    padding: 7px;
    border-bottom: 1px solid var(--divider-color);
  }
  .container {
    @apply flex flex-col items-center;
  }

  .callout {
    @apply flex items-center pb-2 ml-14;
  }

  .icon {
    margin-right: 10px;
  }

  .image {
    height: 30px;
    width: 30px;
    margin-right: 6px;
    border-radius: 5px;
  }
  .image.circle {
    border-radius: 50%;
  }

  .content {
    flex: 1;
    min-width: 0;
  }

  .shortcut {
    font-weight: var(--bold-font-weight);
    color: var(--shortcut-color);
  }
  .shortcut:first-child {
    margin-right: 5px;
  }
  .shortcut:last-child {
    margin-left: 5px;
  }

  .content,
  .subtitle,
  .title {
    @apply line-clamp-1;
  }
  .callout,
  .title,
  .subtitle {
    font-size: 1.2rem;
  }
  .subtitle {
    color: var(--secondary-text-color);
  }
  .title {
    color: var(--accent-color);
  }

  .menu-icon {
    margin-right: -7px;
  }
</style>
