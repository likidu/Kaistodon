<script lang="ts">
  import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
  import type { mastodon } from 'masto';

  import Button from '@/ui/components/buttons/Button.svelte';
  import Typography from '@/ui/components/Typography.svelte';

  import StatusItem from './StatusItem.svelte';

  export let query: CreateInfiniteQueryResult<mastodon.v1.Status[]>;

  let loadMoreTitle: string;

  $: if ($query.isFetching) {
    loadMoreTitle = 'Loading more...';
  } else if ($query.hasNextPage) {
    loadMoreTitle = 'Load more';
  } else {
    loadMoreTitle = 'End of list';
  }

  function parseHtml(html: string): { seralized: string; links: string[] } {
    let links = [];

    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');

    const ellipsises = dom.querySelectorAll('span.ellipsis');
    if (ellipsises.length > 0) {
      ellipsises.forEach((ellipsis) => {
        const a = ellipsis.parentElement;
        // Push href to array for displaying in context menu
        links.push(a.attributes['href'].value);
        // Stylize the link
        const el = ellipsis as HTMLElement;
        el.innerText += '...';
        el.style.color = 'var(--accent-color)';
        // Replace the a tag with span.ellipsis
        a.replaceWith(el);
      });
    }

    const tags = dom.querySelectorAll('a.mention.hashtag');
    if (tags.length > 0) {
      tags.forEach((tag) => {
        // Push href to array for displaying in context menu
        links.push(tag.attributes['href'].value);
        // Get the tag name
        const text = tag.querySelector('span').innerText;
        // Create and add new element
        tag.insertAdjacentHTML('afterend', `<span style="color: var(--accent-color)">#${text}</span>`);
        // Remove the original tag link
        tag.remove();
      });
    }

    // Convert dom back to string
    const seralized = dom.getElementsByTagName('body')[0].innerHTML;
    return { seralized, links };
  }
</script>

{#if $query.isLoading}
  <Typography align="center">Loading...</Typography>
{/if}
{#if $query.error}
  <Typography align="center">Error!</Typography>
{/if}
{#if $query.isSuccess}
  {#each $query.data.pages as page, i}
    {#each page as status, j}
      {#if status.visibility === 'public'}
        <StatusItem {status} />
      {/if}
    {/each}
  {/each}
  <Button
    title={loadMoreTitle}
    disabled={!$query.hasNextPage || $query.isFetchingNextPage}
    navi={{
      itemId: 'STATUS_LOAD_MORE',
      onSelect: () => $query.fetchNextPage(),
    }}
  />
{/if}

<style global lang="postcss">
  .status-content > p:not(:first-child) {
    @apply mt-2;
  }
</style>
