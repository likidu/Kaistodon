<script lang="ts">
  export let title: string = undefined;
  let css: string = '';
  export { css as style };
</script>

<div class="root" style={css}>
  {#if title}
    <h1 class="title">
      {title}
    </h1>
  {:else}
    <slot />
  {/if}
</div>

<style lang="postcss">
  .root {
    @apply flex items-center overflow-hidden whitespace-nowrap px-1 py-0.5;
  }
  .title {
    @apply flex-auto text-center overflow-hidden text-ellipsis px-3;
    color: var(--accent-color);
    font-weight: 600;
  }
</style>
