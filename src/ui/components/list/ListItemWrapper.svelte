<script lang="ts">
  import { Layout } from '../../enums';

  export let layout: Layout;
</script>

{#if layout === Layout.Row}
  <div class="flex flex-row justify-between w-full">
    <slot name="header" />
    <div class="grow">
      <slot name="title" />
    </div>
    <slot name="settings" />
  </div>
  <div class="content">
    <slot name="content" />
  </div>
{:else}
  <slot name="header" />
  <div class="content">
    <slot name="title" />
    <slot name="content" />
  </div>
  <slot name="settings" />
{/if}
