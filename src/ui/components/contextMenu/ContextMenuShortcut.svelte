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
  <Icon size={IconSize.Small}><svelte:component this={icon} /></Icon>
  <p>{text}</p>
</GridItem>
