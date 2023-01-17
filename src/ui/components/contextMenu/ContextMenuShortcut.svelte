<script lang="ts">
  import type { SvelteComponent } from 'svelte';

  import { IconSize } from '../../enums';
  import type { Navigation } from '../../models';
  import GridItem from '../grid/GridItem.svelte';
  import Icon from '../icon/Icon.svelte';

  export let icon: typeof SvelteComponent = null;
  export let text: string;
  export let navi: Navigation;
</script>

<GridItem {navi}>
  <div class="root">
    <div class="container">
      <Icon size={IconSize.Small}><svelte:component this={icon} /></Icon>
      <span class="label">{text}</span>
    </div>
    {#if navi.shortcutKey}
      <p class="shortcut">{navi.shortcutKey}</p>
    {/if}
  </div>
</GridItem>

<style lang="postcss">
  .root {
    @apply flex items-center px-3 py-1;
  }

  .container {
    @apply flex flex-col items-center;
  }

  .label {
    @apply text-sm overflow-hidden text-ellipsis;
  }

  .shortcut {
    font-weight: var(--bold-font-weight);
    color: var(--shortcut-color);
  }
</style>
