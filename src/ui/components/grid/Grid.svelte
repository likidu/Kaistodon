<script lang="ts">
  export let columns = 3;
  export let style = '';
</script>

<div class="root" style={`grid-template-columns: repeat(${columns}, 1fr); ${style}`}>
  <slot />
</div>

<style lang="postcss">
  .root {
    @apply grid auto-rows-max gap-x-1;
  }
</style>
