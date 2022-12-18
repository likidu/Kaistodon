<script lang="ts">
  import ListItem from '@/ui/components/list/ListItem.svelte';
  import Typography from '@/ui/components/Typography.svelte';
  import View from '@/ui/components/view/View.svelte';
  import ViewContent from '@/ui/components/view/ViewContent.svelte';
  import { Alignment } from '@/ui/enums';

  import LineClamp from '@/lib/components/LineClamp.svelte';

  import ViewHeader from '@/ui/components/view/ViewHeader.svelte';
  import { usePublicTimeline } from '../services';

  const timeline = usePublicTimeline();
</script>

<View>
  <ViewHeader title="Home" />
  <ViewContent>
    {#if $timeline.status === 'loading'}
      <Typography align="center">Loading...</Typography>
    {:else if $timeline.status === 'error'}
      <Typography align="center">Error!</Typography>
    {:else}
      {@const items = $timeline.data.value}
      {#each items as item, i}
        <ListItem
          imageUrl={item.account.avatarStatic}
          align={Alignment.Top}
          navi={{ itemId: `timeline-${i + 1}`, onSelect: () => {} }}
        >
          <svelte:fragment slot="primaryText">
            {@html item.content}
          </svelte:fragment>
        </ListItem>
      {/each}
    {/if}
    <LineClamp lines={2}>
      <p class="text-sky-300">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </p>
    </LineClamp>
    <p class="line-clamp-1">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua.
    </p>
    <h1 class="text-slate-500">Vite + Svelte</h1>
  </ViewContent>
</View>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
</style>
