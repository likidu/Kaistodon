<script lang="ts">
  import { IconDotsVertical } from '@/ui/icons';
  import type { SvelteComponent } from 'svelte';
  import { Alignment, Color, IconSize, Layout } from '../../enums';
  import type { ContextMenu, Navigation } from '../../models';
  import { settings } from '../../stores';
  import Icon from '../icon/Icon.svelte';
  import NavItem from '../nav/NavItem.svelte';

  export let layout: Layout = Layout.Row;
  export let imageUrl: string = null;
  export let imageStyle: 'square' | 'circle' = 'square';
  export let imageSize: IconSize = IconSize.Medium;
  export let icon: typeof SvelteComponent = null;
  export let iconColor: Color = Color.Primary;
  export let align: Alignment = Alignment.Top;
  export let titleText: string = null;
  export let subtitleText: string = null;
  export let contentText: string = null;
  export let navi: Navigation;
  export let contextMenu: ContextMenu = null;
  export let nofocus = false;
</script>

<NavItem {navi} {contextMenu} {nofocus}>
  <div class="root" style={`align-items: ${align}`}>
    <div class="flex flex-row justify-between w-full">
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
      <!-- Title in row layout -->
      {#if layout === Layout.Row}
        <div class="grow">
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
        </div>
      {/if}
      {#if $settings.shortcutKeyLocation === 'right' && navi.shortcutKey}
        <div class="shortcut">{navi.shortcutKey}</div>
      {/if}
      {#if $settings.contextMenuIndicators && contextMenu}
        <div class="menu-icon">
          <Icon size={IconSize.Small} color={Color.Secondary}><IconDotsVertical /></Icon>
        </div>
      {/if}
    </div>
    <div class="container">
      <!-- Title in col layout -->
      {#if layout === Layout.Col}
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
      {/if}
      {#if contentText}
        <div class="content">{contentText}</div>
      {:else}
        <slot name="content" />
      {/if}
      <slot name="bottom" />
    </div>
  </div>
</NavItem>

<style lang="postcss">
  .root {
    @apply flex flex-col items-center;
    padding: 7px;
    border-bottom: 1px solid var(--divider-color);
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

  .content,
  .subtitle,
  .title {
    @apply line-clamp-1;
  }
  .subtitle {
    font-size: 1.2rem;
    color: var(--secondary-text-color);
  }
  .title {
    font-size: 1.2rem;
    color: var(--accent-color);
  }

  .menu-icon {
    margin-right: -7px;
  }
</style>
