<script lang="ts">
  import type { mastodon } from 'masto';

  import Grid from '@/ui/components/grid/Grid.svelte';

  export let photos: mastodon.v1.MediaAttachment[];
</script>

{#if photos.length === 1}
  <img src={photos[0].previewUrl} alt={photos[0].description} class="mt-2 mb-4 max-w-full" />
{:else}
  <Grid columns={2}>
    {#each photos as photo}
      <img src={photo.previewUrl} alt={photo.description} />
    {/each}
  </Grid>
{/if}
