<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  import { IconChevronRight } from '@/ui/icons';
  import { Color, IconSize } from '../../enums';
  import type { ContextMenu, Navigation } from '../../models';
  import { settings } from '../../stores';
  import Icon from '../icon/Icon.svelte';
  import NavItem from '../nav/NavItem.svelte';

  export let imageUrl: string = null;
  export let imageStyle: 'square' | 'circle' = 'square';
  export let imageSize: IconSize = IconSize.Medium;
  export let icon: typeof SvelteComponent = null;
  export let iconColor: Color = Color.Primary;
  export let primaryText: string = null;
  export let secondaryText: string = null;
  export let accentText: string = null;
  export let navi: Navigation;
  export let contextMenu: ContextMenu = null;
  export let hasMore = false;
</script>

<NavItem {navi} {contextMenu}>
  <div class="root">
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
    <div class="container">
      <div class="primary">{primaryText}</div>
      {#if secondaryText}
        <div class="secondary">{secondaryText}</div>
      {/if}
      {#if accentText}
        <div class="accent">{accentText}</div>
      {/if}
      <slot name="bottom" />
    </div>
    {#if $settings.shortcutKeyLocation === 'right' && navi.shortcutKey}
      <div class="shortcut">{navi.shortcutKey}</div>
    {/if}
    {#if hasMore && !navi.shortcutKey}
      <div class="more">
        <Icon size={imageSize} color={iconColor}><IconChevronRight /></Icon>
      </div>
    {/if}
  </div>
</NavItem>

<style lang="postcss">
  .root {
    @apply flex items-center p-3;
    border-bottom: 1px solid var(--divider-color);
  }
  .icon {
    margin-right: 10px;
  }
  .image {
    height: 30px;
    width: 30px;
    margin-right: 10px;
    border-radius: 3px;
  }
  .image.circle {
    border-radius: 50%;
  }
  .container {
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
  .primary,
  .secondary,
  .accent {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .secondary {
    font-size: 1.2rem;
    color: var(--secondary-text-color);
  }
  .accent {
    font-size: 1.2rem;
    color: var(--accent-color);
  }
</style>
