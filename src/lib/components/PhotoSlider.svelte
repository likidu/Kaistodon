<script lang="ts">
  import type { mastodon } from 'masto';

  export let photos: mastodon.v1.MediaAttachment[];
</script>

{#if photos.length === 1}
  <img src={photos[0].previewUrl} alt={photos[0].description} class="mt-2 mb-4 max-w-full" />
{/if}
