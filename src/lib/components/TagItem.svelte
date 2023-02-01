<script lang="ts">
  import type { mastodon } from 'masto';

  import ListSimpleItem from '@/ui/components/list/ListSimpleItem.svelte';

  export let tag: mastodon.v1.Tag;
  export let index: number;
</script>

<ListSimpleItem
  primaryText={`#${tag.name}`}
  secondaryText={`${tag.history[0].uses} people talking`}
  navi={{ itemId: `TAG_${index + 1}`, onSelect: () => {} }}
/>
